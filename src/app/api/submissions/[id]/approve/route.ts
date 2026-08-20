import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json().catch(() => ({}))
    const action = body.action as string | undefined

    const submission = await prisma.submission.findUnique({
      where: { id },
      select: { id: true, status: true, userId: true },
    })

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    let newStatus: string
    if (action === "publish") {
      if (submission.status !== "APPROVED") {
        return NextResponse.json({ error: "Must be approved before publishing" }, { status: 409 })
      }
      newStatus = "PUBLISHED"
    } else if (action === "reject") {
      newStatus = "REVISION"
    } else {
      if (submission.status !== "DRAFT" && submission.status !== "UNDER_REVIEW" && submission.status !== "REVISION") {
        return NextResponse.json({ error: `Cannot approve submission in ${submission.status} status` }, { status: 409 })
      }
      newStatus = "APPROVED"
    }

    const updated = await prisma.submission.update({
      where: { id },
      data: { status: newStatus as "APPROVED" | "PUBLISHED" | "REVISION" },
    })

    return NextResponse.json({ ok: true, status: updated.status })
  } catch (err) {
    console.error("Approval error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
