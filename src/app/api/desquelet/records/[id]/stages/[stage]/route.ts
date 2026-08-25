import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DESQUELET_STAGE_ORDER } from "@/lib/desquelet-prompts"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; stage: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, stage } = await params

    const record = await prisma.desqueletRecord.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    if (record.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const stageContent = await prisma.desqueletStageContent.findUnique({
      where: { recordId_stage: { recordId: id, stage: stage as "D" | "E1" | "S" | "Q" | "U" | "E2" | "L" | "E3" | "T" } },
      include: {
        evidence: { orderBy: { createdAt: "desc" } },
        reviews: {
          include: { reviewer: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })

    if (!stageContent) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 })
    }

    return NextResponse.json(stageContent)
  } catch (err) {
    console.error("DESQUELET stage fetch error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; stage: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, stage } = await params
    const body = await req.json()

    const record = await prisma.desqueletRecord.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    if (record.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data: Record<string, unknown> = {}
    if (body.content !== undefined) data.content = body.content
    if (body.percentageComplete !== undefined) {
      data.percentageComplete = Math.min(100, Math.max(0, body.percentageComplete))
    }
    data.lastEditedAt = new Date()

    const updated = await prisma.desqueletStageContent.update({
      where: { recordId_stage: { recordId: id, stage: stage as "D" | "E1" | "S" | "Q" | "U" | "E2" | "L" | "E3" | "T" } },
      data,
    })

    const allStages = await prisma.desqueletStageContent.findMany({
      where: { recordId: id },
      select: { percentageComplete: true },
    })

    const totalProgress = allStages.length > 0
      ? Math.round(allStages.reduce((sum, s) => sum + s.percentageComplete, 0) / allStages.length)
      : 0

    return NextResponse.json({ ...updated, overallProgress: totalProgress })
  } catch (err) {
    console.error("DESQUELET stage update error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
