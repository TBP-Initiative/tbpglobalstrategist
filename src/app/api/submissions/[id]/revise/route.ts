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
    const { title, description, fileUrl, fileType, fileSize, changelog } = body

    if (!fileUrl || !fileType) {
      return NextResponse.json({ error: "File is required for a revision" }, { status: 422 })
    }

    const parent = await prisma.submission.findUnique({
      where: { id },
      select: { id: true, userId: true, projectId: true, version: true, status: true, stage: true, title: true, isLatest: true },
    })

    if (!parent) {
      return NextResponse.json({ error: "Original submission not found" }, { status: 404 })
    }

    if (parent.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (parent.status === "PUBLISHED") {
      return NextResponse.json({ error: "Cannot revise a published submission. Create a new submission instead." }, { status: 409 })
    }

    const newVersion = parent.version + 1

    const result = await prisma.$transaction(async (tx) => {
      if (parent.isLatest) {
        await tx.submission.update({
          where: { id },
          data: { isLatest: false },
        })
      }

      const revision = await tx.submission.create({
        data: {
          userId: session.user.id,
          projectId: parent.projectId,
          stage: parent.stage,
          title: title || parent.title,
          description: description ?? null,
          fileUrl,
          fileType,
          fileSize: fileSize ? parseInt(String(fileSize), 10) : null,
          version: newVersion,
          isLatest: true,
          status: "REVISION",
          changelog: changelog || null,
          parentSubmissionId: parent.id,
        },
      })

      return revision
    })

    return NextResponse.json(result, { status: 201 })
  } catch (err) {
    console.error("Revision error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
