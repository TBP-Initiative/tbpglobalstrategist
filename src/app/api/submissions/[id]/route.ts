import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, title: true, slug: true } },
        parentSubmission: { select: { id: true, version: true, title: true } },
        revisions: {
          orderBy: { version: "desc" },
          select: { id: true, version: true, title: true, status: true, createdAt: true },
        },
      },
    })
    if (!submission) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(submission)
  } catch (err) {
    console.error("Submission fetch error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
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
    const { status, title, description } = body

    const submission = await prisma.submission.findUnique({
      where: { id },
      select: { id: true, userId: true, status: true },
    })

    if (!submission) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (submission.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data: Record<string, unknown> = {}
    if (title !== undefined) data.title = title
    if (description !== undefined) data.description = description
    if (status !== undefined) {
      if (status === "UNDER_REVIEW" && (submission.status === "DRAFT" || submission.status === "REVISION")) {
        data.status = "UNDER_REVIEW"
      } else if (status === "DRAFT" && submission.status === "REVISION") {
        data.status = "DRAFT"
      } else {
        return NextResponse.json({ error: `Cannot change status from ${submission.status} to ${status}` }, { status: 409 })
      }
    }

    const updated = await prisma.submission.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (err) {
    console.error("Submission update error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const submission = await prisma.submission.findUnique({
      where: { id },
      select: { id: true, isLatest: true, parentSubmissionId: true },
    })

    if (!submission) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.submission.delete({ where: { id } })

    if (submission.isLatest && submission.parentSubmissionId) {
      const prevVersion = await prisma.submission.findFirst({
        where: { id: submission.parentSubmissionId },
        select: { id: true },
      })
      if (prevVersion) {
        await prisma.submission.update({
          where: { id: prevVersion.id },
          data: { isLatest: true },
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Submission delete error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
