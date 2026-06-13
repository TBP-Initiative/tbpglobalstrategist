import { prisma } from "@/lib/prisma"
import { ALL_CATEGORIES } from "@/config/categories"
import { computeProgress } from "@/lib/project-utils"
import { ProjectsDirectory } from "./projects-directory"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Projects",
  description: "Explore strategic initiatives, public programs, institutional projects, and innovation labs driving global transformation.",
}

function parseFirstCategory(cat: string | null): string {
  if (!cat) return ""
  try {
    const parsed = JSON.parse(cat)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : typeof parsed === "string" ? parsed : ""
  } catch {
    return cat
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#x2F;/g, "/")
}

function statusToDisplay(status: string): "active" | "completed" | "on-hold" | "draft" {
  switch (status) {
    case "ACTIVE": return "active"
    case "COMPLETED": return "completed"
    case "CANCELLED": return "on-hold"
    default: return "draft"
  }
}

async function getFeaturedProjects() {
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
      milestones: {
        select: { id: true, completed: true, weight: true },
      },
      organization: { select: { name: true, slug: true } },
      contributors: {
        select: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      },
    },
    orderBy: { featuredAt: "desc" },
    take: 4,
  })

  return projects.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description ? stripHtml(p.description) : "",
    image: p.image,
    category: parseFirstCategory(p.category),
    status: p.status,
    featuredAt: p.featuredAt?.toISOString() ?? null,
    organization: p.organization,
    contributors: p.contributors.map((c) => ({
      name: c.user.name ?? "Unknown",
      avatar: c.user.image,
    })),
    contributorCount: p.contributors.length,
  }))
}

async function getAllProjects() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      description: true,
      category: true,
      status: true,
      image: true,
      milestones: {
        select: { id: true, completed: true, weight: true },
      },
      contributors: {
        select: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.shortDescription ?? (p.description ? stripHtml(p.description) : ""),
    image: p.image,
    category: parseFirstCategory(p.category),
    status: statusToDisplay(p.status),
    progress: computeProgress(p.milestones),
    contributorCount: p.contributors.length,
    contributors: p.contributors.map((c) => ({
      name: c.user.name ?? "Unknown",
      avatar: c.user.image,
    })),
  }))
}

const categories = ["All", ...ALL_CATEGORIES]

export default async function ProjectsPage() {
  const [featuredProjects, allProjects] = await Promise.all([
    getFeaturedProjects(),
    getAllProjects(),
  ])

  return (
    <div className="min-h-screen">
      <ProjectsDirectory
        categories={categories}
        featuredProjects={featuredProjects}
        allProjects={allProjects}
      />
    </div>
  )
}
