import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DESQUELET_STAGE_ORDER } from "@/lib/desquelet-prompts"

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
      select: { id: true, eligiblePathways: true },
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

    const submission = await prisma.onboardingSubmission.findUnique({
      where: { userId: session.user.id },
      select: { pathway: true },
    })
    const userPathway = submission?.pathway ?? null

    if (project.eligiblePathways && project.eligiblePathways !== "BOTH" && userPathway && userPathway !== project.eligiblePathways) {
      const projectPathwayLabel = project.eligiblePathways === "FELLOWSHIP" ? "TBP Global Strategist Fellowship" : "Applied R&D & Technology Development"
      const userPathwayLabel = userPathway === "FELLOWSHIP" || userPathway === "STANDARD" ? "TBP Global Strategist Fellowship" : "Applied R&D & Technology Development"
      return NextResponse.json({
        error: "Pathway mismatch",
        pathwayMismatch: true,
        projectPathway: project.eligiblePathways,
        projectPathwayLabel,
        userPathway,
        userPathwayLabel,
      }, { status: 403 })
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

    const existingRecord = await prisma.desqueletRecord.findUnique({
      where: { userId_projectId: { userId: session.user.id, projectId } },
    })

    if (!existingRecord) {
      const projectTitle = await prisma.project.findUnique({
        where: { id: projectId },
        select: { title: true },
      })

      await prisma.desqueletRecord.create({
        data: {
          userId: session.user.id,
          projectId,
          title: projectTitle?.title || "Workstream Record",
          stages: {
            create: DESQUELET_STAGE_ORDER.map((stage) => ({
              stage: stage as "D" | "E1" | "S" | "Q" | "U" | "E2" | "L" | "E3" | "T",
              content: {},
              percentageComplete: 0,
            })),
          },
        },
      })
    }

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
