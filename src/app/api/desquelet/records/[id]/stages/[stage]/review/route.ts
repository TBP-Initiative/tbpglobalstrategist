import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; stage: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, isPublishAssessor: true },
    })

    const canAssess = currentUser?.role === "ADMIN" || currentUser?.isPublishAssessor
    if (!canAssess) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, stage } = await params
    const body = await req.json()
    const { action, feedback } = body

    const stageContent = await prisma.desqueletStageContent.findUnique({
      where: { recordId_stage: { recordId: id, stage: stage as "D" | "E1" | "S" | "Q" | "U" | "E2" | "L" | "E3" | "T" } },
      select: { id: true },
    })

    if (!stageContent) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 })
    }

    const review = await prisma.desqueletReview.findFirst({
      where: {
        stageContentId: stageContent.id,
        reviewerId: session.user.id,
        status: "PENDING",
      },
    })

    if (!review) {
      return NextResponse.json({ error: "No pending review found" }, { status: 404 })
    }

    let newStatus: "APPROVED" | "REVISION_REQUIRED" | "FURTHER_EVIDENCE_REQUIRED"
    if (action === "approve") {
      newStatus = "APPROVED"
    } else if (action === "reject") {
      newStatus = "REVISION_REQUIRED"
    } else if (action === "evidence") {
      newStatus = "FURTHER_EVIDENCE_REQUIRED"
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 422 })
    }

    const updated = await prisma.desqueletReview.update({
      where: { id: review.id },
      data: {
        status: newStatus,
        feedback: feedback || null,
      },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error("DESQUELET review error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    const stageContent = await prisma.desqueletStageContent.findUnique({
      where: { recordId_stage: { recordId: id, stage: stage as "D" | "E1" | "S" | "Q" | "U" | "E2" | "L" | "E3" | "T" } },
      select: { id: true },
    })

    if (!stageContent) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 })
    }

    const reviews = await prisma.desqueletReview.findMany({
      where: { stageContentId: stageContent.id },
      include: { reviewer: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(reviews)
  } catch (err) {
    console.error("DESQUELET reviews fetch error:", err)
    return NextResponse.json([], { status: 200 })
  }
}
