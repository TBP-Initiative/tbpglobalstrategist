import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const records = await prisma.desqueletRecord.findMany({
      where: { userId: session.user.id },
      include: {
        stages: {
          select: { percentageComplete: true },
        },
        iterations: {
          select: { id: true },
        },
        milestones: {
          select: { id: true },
        },
      },
    })

    const allStages = records.flatMap((r) => r.stages)
    const activeWorkstreams = records.length
    const stagesCompleted = allStages.filter((s) => s.percentageComplete >= 100).length
    const researchIterations = records.reduce((sum, r) => sum + r.iterations.length, 0)
    const validatedOutputs = records.reduce((sum, r) => sum + r.milestones.length, 0)
    const overallProgress = allStages.length > 0
      ? Math.round(allStages.reduce((sum, s) => sum + s.percentageComplete, 0) / allStages.length)
      : 0

    const reviews = await prisma.desqueletReview.count({
      where: {
        stageContent: {
          record: { userId: session.user.id },
        },
      },
    })

    return NextResponse.json({
      activeWorkstreams,
      stagesCompleted,
      totalStages: allStages.length,
      researchIterations,
      validatedOutputs,
      assessorReviews: reviews,
      overallProgress,
    })
  } catch (err) {
    console.error("DESQUELET stats error:", err)
    return NextResponse.json(
      {
        activeWorkstreams: 0,
        stagesCompleted: 0,
        totalStages: 0,
        researchIterations: 0,
        validatedOutputs: 0,
        assessorReviews: 0,
        overallProgress: 0,
      },
      { status: 200 }
    )
  }
}
