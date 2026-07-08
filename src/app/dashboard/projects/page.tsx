import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ProjectsClient } from "./projects-client"

export default async function AdminProjectsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard")

  // Ensure default organization exists
  const defaultOrg = await prisma.organization.upsert({
    where: { slug: "tbp-world-vision-project" },
    update: {},
    create: { name: "TBP World Vision Project", slug: "tbp-world-vision-project" },
  })

  const [projects, organizations] = await Promise.all([
    prisma.project.findMany({
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
      orderBy: { createdAt: "desc" },
    }),
    prisma.organization.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ])

  const serialized = projects.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    status: p.status,
    budget: p.budget?.toString() ?? null,
    createdAt: p.createdAt.toISOString(),
    isFeatured: p.isFeatured,
    featuredAt: p.featuredAt?.toISOString() ?? null,
    image: p.image,
    category: p.category,
    description: p.description,
    shortDescription: p.shortDescription,
    objectives: p.objectives,
    strategicRelevance: p.strategicRelevance,
    startDate: p.startDate?.toISOString() ?? null,
    endDate: p.endDate?.toISOString() ?? null,
    organization: p.organization,
    createdBy: p.createdBy,
    contributors: p._count.contributors,
  }))

  const serializedOrgs = [
    { id: defaultOrg.id, name: defaultOrg.name, slug: defaultOrg.slug },
    ...organizations
      .filter((o) => o.id !== defaultOrg.id)
      .map((o) => ({ id: o.id, name: o.name, slug: o.slug })),
  ]

  const counts = {
    total: projects.length,
    active: projects.filter((p) => p.status === "ACTIVE").length,
    draft: projects.filter((p) => p.status === "DRAFT").length,
    completed: projects.filter((p) => p.status === "COMPLETED").length,
    cancelled: projects.filter((p) => p.status === "CANCELLED").length,
  }

  return <ProjectsClient projects={serialized} organizations={serializedOrgs} counts={counts} />
}
