import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, shortDescription, description, objectives, strategicRelevance, image, status, budget, organizationId, startDate, endDate, categories, newOrganizationName } = body

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 422 })
    }

    // Create new organization if name provided
    let resolvedOrgId = organizationId
    if (newOrganizationName && typeof newOrganizationName === "string") {
      const orgSlug = newOrganizationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      const org = await prisma.organization.upsert({
        where: { slug: orgSlug },
        update: {},
        create: { name: newOrganizationName.trim(), slug: orgSlug },
      })
      resolvedOrgId = org.id
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const existing = await prisma.project.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: "A project with this title already exists" }, { status: 409 })
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        shortDescription: shortDescription ?? null,
        description: description ?? null,
        objectives: objectives ?? null,
        strategicRelevance: strategicRelevance ?? null,
        image: image ?? null,
        status: status ?? "DRAFT",
        budget: budget ? Number(budget) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        category: categories ? JSON.stringify(categories) : null,
        organizationId: resolvedOrgId ?? null,
        createdById: session.user.id!,
      },
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
        shortDescription: true,
        description: true,
        objectives: true,
        strategicRelevance: true,
        startDate: true,
        endDate: true,
        organization: { select: { id: true, name: true, slug: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        _count: { select: { contributors: true } },
      },
    })

    const { _count, ...rest } = project
    return NextResponse.json({ ...rest, contributors: _count.contributors }, { status: 201 })
  } catch (error) {
    console.error("Failed to create project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
