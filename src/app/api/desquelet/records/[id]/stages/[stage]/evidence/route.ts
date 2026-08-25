import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

    if (!record || (record.userId !== session.user.id && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const stageContent = await prisma.desqueletStageContent.findUnique({
      where: { recordId_stage: { recordId: id, stage: stage as "D" | "E1" | "S" | "Q" | "U" | "E2" | "L" | "E3" | "T" } },
      select: { id: true },
    })

    if (!stageContent) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 })
    }

    const evidence = await prisma.desqueletEvidence.findMany({
      where: { stageContentId: stageContent.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(evidence)
  } catch (err) {
    console.error("DESQUELET evidence fetch error:", err)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(
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

    if (!record || record.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const stageContent = await prisma.desqueletStageContent.findUnique({
      where: { recordId_stage: { recordId: id, stage: stage as "D" | "E1" | "S" | "Q" | "U" | "E2" | "L" | "E3" | "T" } },
      select: { id: true },
    })

    if (!stageContent) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 })
    }

    const { fileName, fileUrl, fileType, fileSize, description, category } = body

    if (!fileName || !fileUrl || !fileType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 422 })
    }

    const evidence = await prisma.desqueletEvidence.create({
      data: {
        stageContentId: stageContent.id,
        fileName,
        fileUrl,
        fileType,
        fileSize: fileSize ? parseInt(String(fileSize), 10) : null,
        description: description || null,
        category: category || null,
      },
    })

    return NextResponse.json(evidence, { status: 201 })
  } catch (err) {
    console.error("DESQUELET evidence creation error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; stage: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, stage } = await params
    const { searchParams } = new URL(req.url)
    const evidenceId = searchParams.get("evidenceId")

    if (!evidenceId) {
      return NextResponse.json({ error: "Evidence ID required" }, { status: 422 })
    }

    const record = await prisma.desqueletRecord.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!record || record.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const evidence = await prisma.desqueletEvidence.findUnique({
      where: { id: evidenceId },
      select: { id: true, stageContent: { select: { recordId: true } } },
    })

    if (!evidence || evidence.stageContent.recordId !== id) {
      return NextResponse.json({ error: "Evidence not found" }, { status: 404 })
    }

    await prisma.desqueletEvidence.delete({ where: { id: evidenceId } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("DESQUELET evidence delete error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
