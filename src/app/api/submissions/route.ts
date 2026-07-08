import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const submissions = await prisma.submission.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(submissions)
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { stage, title, description, fileUrl, fileType, fileSize } = body

    if (!stage || !title || !fileUrl || !fileType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 422 })
    }

    const submission = await prisma.submission.create({
      data: {
        userId: session.user.id,
        stage,
        title,
        description,
        fileUrl,
        fileType,
        fileSize: fileSize ? parseInt(fileSize, 10) : null,
      },
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (err) {
    console.error("Submission error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
