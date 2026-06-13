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
    const { relatedProjectId, relationType } = body

    if (!relatedProjectId) {
      return NextResponse.json({ error: "relatedProjectId is required" }, { status: 422 })
    }

    if (relatedProjectId === id) {
      return NextResponse.json({ error: "Cannot relate a project to itself" }, { status: 422 })
    }

    const relatedProject = await prisma.project.findUnique({ where: { id: relatedProjectId } })
    if (!relatedProject) {
      return NextResponse.json({ error: "Related project not found" }, { status: 404 })
    }

    const existing = await prisma.projectRelation.findUnique({
      where: { projectId_relatedProjectId: { projectId: id, relatedProjectId } },
    })
    if (existing) {
      return NextResponse.json({ error: "Relation already exists" }, { status: 409 })
    }

    const relation = await prisma.projectRelation.create({
      data: {
        projectId: id,
        relatedProjectId,
        relationType: relationType ?? "RELATED",
      },
      select: {
        id: true,
        relationType: true,
        relatedProject: {
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
            category: true,
            shortDescription: true,
            status: true,
          },
        },
      },
    })

    return NextResponse.json(relation, { status: 201 })
  } catch (error) {
    console.error("Failed to add relation:", error)
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
    const relatedProjectId = searchParams.get("relatedProjectId")
    if (!relatedProjectId) {
      return NextResponse.json({ error: "relatedProjectId is required" }, { status: 422 })
    }

    await prisma.projectRelation.delete({
      where: { projectId_relatedProjectId: { projectId: id, relatedProjectId } },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete relation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
