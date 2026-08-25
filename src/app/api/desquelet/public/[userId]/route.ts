import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { DESQUELET_STAGE_ORDER, DESQUELET_STAGE_MAP } from "@/lib/desquelet-prompts"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    const records = await prisma.desqueletRecord.findMany({
      where: {
        userId,
        visibility: "PUBLIC",
      },
      include: {
        project: { select: { id: true, title: true, slug: true } },
        stages: {
          select: { stage: true, percentageComplete: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    const publicData = records.map((record) => {
      const stages = DESQUELET_STAGE_ORDER.map((key) => {
        const stageData = record.stages.find((s) => s.stage === key)
        const percentage = stageData?.percentageComplete ?? 0
        const config = DESQUELET_STAGE_MAP[key]
        return {
          letter: config.letter,
          name: config.name,
          status: percentage >= 100 ? "completed" : percentage > 0 ? "in_progress" : "pending",
        }
      })

      const overallProgress = record.stages.length > 0
        ? Math.round(record.stages.reduce((sum, s) => sum + s.percentageComplete, 0) / record.stages.length)
        : 0

      return {
        id: record.id,
        title: record.title,
        project: record.project,
        stages,
        overallProgress,
        currentRevision: record.currentRevision,
        lastUpdated: record.updatedAt,
      }
    })

    const totalStagesCompleted = publicData.reduce(
      (sum, r) => sum + r.stages.filter((s) => s.status === "completed").length,
      0
    )
    const overallProgress = publicData.length > 0
      ? Math.round(publicData.reduce((sum, r) => sum + r.overallProgress, 0) / publicData.length)
      : 0

    return NextResponse.json({
      records: publicData,
      summary: {
        totalWorkstreams: publicData.length,
        stagesCompleted: totalStagesCompleted,
        overallProgress,
      },
    })
  } catch (err) {
    console.error("DESQUELET public profile error:", err)
    return NextResponse.json({ records: [], summary: { totalWorkstreams: 0, stagesCompleted: 0, overallProgress: 0 } }, { status: 200 })
  }
}
