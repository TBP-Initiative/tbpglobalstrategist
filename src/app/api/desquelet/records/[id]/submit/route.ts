import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
    const { stage } = body

    const record = await prisma.desqueletRecord.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!record || record.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (!stage) {
      return NextResponse.json({ error: "Stage is required" }, { status: 422 })
    }

    const stageContent = await prisma.desqueletStageContent.findUnique({
      where: { recordId_stage: { recordId: id, stage } },
      select: { id: true },
    })

    if (!stageContent) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 })
    }

    const existingReview = await prisma.desqueletReview.findFirst({
      where: {
        stageContentId: stageContent.id,
        status: "PENDING",
      },
    })

    if (existingReview) {
      return NextResponse.json({ error: "Stage already submitted for review" }, { status: 409 })
    }

    const admins = await prisma.user.findMany({
      where: { OR: [{ role: "ADMIN" }, { isPublishAssessor: true }] },
      select: { id: true },
    })

    if (admins.length === 0) {
      return NextResponse.json({ error: "No assessors available" }, { status: 500 })
    }

    const reviews = await prisma.$transaction(
      admins.map((admin) =>
        prisma.desqueletReview.create({
          data: {
            stageContentId: stageContent.id,
            reviewerId: admin.id,
            status: "PENDING",
          },
        })
      )
    )

    return NextResponse.json({ reviews, submittedAt: new Date() }, { status: 201 })
  } catch (err) {
    console.error("DESQUELET submit for review error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
