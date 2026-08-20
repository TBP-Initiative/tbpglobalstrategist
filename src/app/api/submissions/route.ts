import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const latestOnly = searchParams.get("latestOnly") === "true"

    const where: Record<string, unknown> = { userId: session.user.id }
    if (projectId) where.projectId = projectId
    if (latestOnly) where.isLatest = true

    const submissions = await prisma.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        project: { select: { id: true, title: true, slug: true } },
        revisions: {
          orderBy: { version: "desc" },
          select: { id: true, version: true, status: true, title: true, createdAt: true },
        },
      },
    })

    return NextResponse.json(submissions)
  } catch (err) {
    console.error("Submissions fetch error:", err)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { stage, title, description, fileUrl, fileType, fileSize, projectId, status } = body

    if (!stage || !title || !fileUrl || !fileType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 422 })
    }

    const submission = await prisma.submission.create({
      data: {
        userId: session.user.id,
        projectId: projectId || null,
        stage,
        title,
        description,
        fileUrl,
        fileType,
        fileSize: fileSize ? parseInt(String(fileSize), 10) : null,
        version: 1,
        isLatest: true,
        status: status || "DRAFT",
      },
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (err) {
    console.error("Submission error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
