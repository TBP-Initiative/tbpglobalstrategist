import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const projects = await prisma.project.findMany({
    where: { isFeatured: true },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      image: true,
      category: true,
      status: true,
      featuredAt: true,
      organization: { select: { name: true, slug: true } },
      contributors: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: { featuredAt: "desc" },
    take: 4,
  })

  const serialized = projects.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description ?? "",
    image: p.image,
    category: p.category ?? "",
    status: p.status.toLowerCase(),
    featuredAt: p.featuredAt?.toISOString() ?? null,
    organization: p.organization,
    contributors: p.contributors.map((c) => ({
      name: c.user.name ?? "Unknown",
      avatar: c.user.image,
    })),
    contributorCount: p.contributors.length,
  }))

  return NextResponse.json(serialized)
}
