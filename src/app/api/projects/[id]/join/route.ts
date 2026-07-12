import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: projectId } = await params

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    })
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const existing = await prisma.projectContributor.findUnique({
      where: { projectId_userId: { projectId, userId: session.user.id } },
    })
    if (existing) {
      return NextResponse.json({ ok: true, message: "Already a contributor" })
    }

    const profile = await prisma.strategistProfile.findUnique({
      where: { userId: session.user.id },
      select: { stage: true },
    })

    const stageOrder = ["CANDIDATE", "STRATEGIST", "CONTRIBUTOR", "PROJECT_ALIGNED", "SECTOR_LEAD", "PAID_ADVISER"]
    const currentStageIndex = stageOrder.indexOf(profile?.stage ?? "CANDIDATE")
    if (currentStageIndex < stageOrder.indexOf("STRATEGIST")) {
      return NextResponse.json({ error: "Must reach Strategist stage" }, { status: 403 })
    }

    await prisma.projectContributor.create({
      data: {
        projectId,
        userId: session.user.id,
        role: "CONTRIBUTOR",
      },
    })

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "PROJECT_JOIN",
        entity: "Project",
        entityId: projectId,
        metadata: JSON.stringify({ projectId }),
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Join project error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
