import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      relations: {
        select: {
          relationType: true,
          relatedProject: {
            select: { id: true, title: true, slug: true, image: true, category: true, status: true },
          },
        },
      },
      media: {
        select: { id: true, type: true, url: true, title: true, fileType: true, fileSize: true },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  return NextResponse.json(project)
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

  const project = await prisma.project.findUnique({ where: { id } })
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  try {
    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
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
    const { title, shortDescription, description, objectives, strategicRelevance, image, status, budget, organizationId, startDate, endDate, categories } = body

    const data: Record<string, unknown> = {}

    if (title !== undefined) {
      if (typeof title !== "string") {
        return NextResponse.json({ error: "Title must be a string" }, { status: 422 })
      }
      data.title = title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      const existing = await prisma.project.findFirst({
        where: { slug, id: { not: id } },
      })
      if (existing) {
        return NextResponse.json({ error: "Another project with this title already exists" }, { status: 409 })
      }
      data.slug = slug
    }
    if (shortDescription !== undefined) data.shortDescription = shortDescription
    if (description !== undefined) data.description = description
    if (objectives !== undefined) data.objectives = objectives
    if (strategicRelevance !== undefined) data.strategicRelevance = strategicRelevance
    if (image !== undefined) data.image = image
    if (status !== undefined) data.status = status
    if (categories !== undefined) data.category = categories.length > 0 ? JSON.stringify(categories) : null
    if (budget !== undefined) data.budget = budget ? Number(budget) : null
    if (organizationId !== undefined) data.organizationId = organizationId ?? null
    if (startDate !== undefined) data.startDate = startDate ? new Date(startDate) : null
    if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null

    const updated = await prisma.project.update({
      where: { id },
      data,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        budget: true,
        createdAt: true,
        isFeatured: true,
        featuredAt: true,
        image: true,
        category: true,
        description: true,
        shortDescription: true,
        objectives: true,
        strategicRelevance: true,
        startDate: true,
        endDate: true,
        organization: { select: { id: true, name: true, slug: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        _count: { select: { contributors: true } },
      },
    })

    const { _count, ...rest } = updated
    return NextResponse.json({ ...rest, contributors: _count.contributors })
  } catch (error) {
    console.error("Failed to update project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
