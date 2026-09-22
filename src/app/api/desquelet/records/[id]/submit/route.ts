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
      select: { userId: true, user: { select: { assessorId: true } } },
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

    let reviewerIds: string[] = []

    if (record.user.assessorId) {
      const assigned = await prisma.user.findFirst({
        where: {
          id: record.user.assessorId,
          OR: [{ role: "ADMIN" }, { isPublishAssessor: true }],
        },
        select: { id: true },
      })
      if (assigned) reviewerIds = [assigned.id]
    }

    if (reviewerIds.length === 0) {
      const fallback = await prisma.user.findMany({
        where: { OR: [{ role: "ADMIN" }, { isPublishAssessor: true }] },
        select: { id: true },
      })
      reviewerIds = fallback.map((a) => a.id)
    }

    if (reviewerIds.length === 0) {
      return NextResponse.json({ error: "No assessors available" }, { status: 500 })
    }

    const reviews = await prisma.$transaction(
      reviewerIds.map((reviewerId) =>
        prisma.desqueletReview.create({
          data: {
            stageContentId: stageContent.id,
            reviewerId,
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
