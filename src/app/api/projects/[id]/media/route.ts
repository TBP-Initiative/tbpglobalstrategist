import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const project = await prisma.project.findUnique({ where: { id } })
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  try {
    const body = await request.json()
    const { type, url, title, fileType, fileSize } = body

    if (!type || !url) {
      return NextResponse.json({ error: "Type and URL are required" }, { status: 422 })
    }

    const media = await prisma.projectMedia.create({
      data: {
        projectId: id,
        type,
        url,
        title: title ?? null,
        fileType: fileType ?? null,
        fileSize: fileSize ? Number(fileSize) : null,
      },
    })

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    console.error("Failed to add media:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const { searchParams } = new URL(request.url)
    const mediaId = searchParams.get("mediaId")
    if (!mediaId) {
      return NextResponse.json({ error: "mediaId is required" }, { status: 422 })
    }

    await prisma.projectMedia.delete({
      where: { id: mediaId, projectId: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete media:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
