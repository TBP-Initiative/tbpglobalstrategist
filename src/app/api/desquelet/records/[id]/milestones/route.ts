import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const record = await prisma.desqueletRecord.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!record || (record.userId !== session.user.id && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const milestones = await prisma.desqueletMilestone.findMany({
      where: { recordId: id },
      orderBy: { version: "desc" },
    })

    return NextResponse.json(milestones)
  } catch (err) {
    console.error("DESQUELET milestones fetch error:", err)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { label, reason } = body

    const record = await prisma.desqueletRecord.findUnique({
      where: { id },
      select: { userId: true, currentRevision: true },
    })

    if (!record || record.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (!label) {
      return NextResponse.json({ error: "Label is required" }, { status: 422 })
    }

    const stages = await prisma.desqueletStageContent.findMany({
      where: { recordId: id },
      select: { stage: true, content: true, percentageComplete: true },
    })

    const snapshot = JSON.parse(JSON.stringify(stages))
    const nextVersion = record.currentRevision + 1

    const [milestone, updatedRecord] = await prisma.$transaction([
      prisma.desqueletMilestone.create({
        data: {
          recordId: id,
          version: nextVersion,
          label,
          reason: reason || null,
          snapshot,
        },
      }),
      prisma.desqueletRecord.update({
        where: { id },
        data: { currentRevision: nextVersion },
      }),
    ])

    return NextResponse.json({ milestone, record: updatedRecord }, { status: 201 })
  } catch (err) {
    console.error("DESQUELET milestone creation error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
