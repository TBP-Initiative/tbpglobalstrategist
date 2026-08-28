import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DESQUELET_STAGE_ORDER } from "@/lib/desquelet-prompts"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [records, contributors] = await Promise.all([
      prisma.desqueletRecord.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
        include: {
          project: { select: { id: true, title: true, slug: true } },
          stages: {
            select: { stage: true, percentageComplete: true, lastEditedAt: true },
          },
          iterations: {
            select: { id: true },
          },
          milestones: {
            select: { id: true },
            orderBy: { version: "desc" },
            take: 1,
          },
        },
      }),
      prisma.projectContributor.findMany({
        where: { userId: session.user.id },
        select: {
          project: { select: { id: true, title: true, slug: true, status: true } },
        },
      }),
    ])

    const existingProjectIds = new Set(records.filter((r) => r.projectId).map((r) => r.projectId as string))
    const availableProjects = contributors
      .map((c) => c.project)
      .filter((p) => !existingProjectIds.has(p.id))

    const result = records.map((r) => {
      const totalProgress = r.stages.length > 0
        ? Math.round(r.stages.reduce((sum, s) => sum + s.percentageComplete, 0) / r.stages.length)
        : 0
      const completedStages = r.stages.filter((s) => s.percentageComplete >= 100).length
      const lastEdited = r.stages.length > 0
        ? r.stages.reduce((latest, s) => s.lastEditedAt > latest ? s.lastEditedAt : latest, r.stages[0].lastEditedAt)
        : r.updatedAt

      return {
        id: r.id,
        title: r.title,
        currentRevision: r.currentRevision,
        overallProgress: totalProgress,
        completedStages,
        totalStages: DESQUELET_STAGE_ORDER.length,
        iterations: r.iterations.length,
        milestones: r.milestones.length,
        lastUpdated: lastEdited,
        createdAt: r.createdAt,
        project: r.project,
      }
    })

    return NextResponse.json({ records: result, availableProjects })
  } catch (err) {
    console.error("DESQUELET records fetch error:", err)
    return NextResponse.json({ records: [], availableProjects: [] }, { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { projectId, title } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 422 })
    }

    if (projectId) {
      const existing = await prisma.desqueletRecord.findUnique({
        where: { userId_projectId: { userId: session.user.id, projectId } },
      })
      if (existing) {
        return NextResponse.json({ error: "Record already exists for this project" }, { status: 409 })
      }
    }

    const record = await prisma.desqueletRecord.create({
      data: {
        userId: session.user.id,
        projectId: projectId || null,
        title,
        stages: {
          create: DESQUELET_STAGE_ORDER.map((stage) => ({
            stage: stage as "D" | "E1" | "S" | "Q" | "U" | "E2" | "L" | "E3" | "T",
            content: {},
            percentageComplete: 0,
          })),
        },
      },
      include: {
        project: { select: { id: true, title: true, slug: true } },
        stages: true,
      },
    })

    return NextResponse.json(record, { status: 201 })
  } catch (err) {
    console.error("DESQUELET record creation error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
