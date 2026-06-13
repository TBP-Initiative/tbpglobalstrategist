import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import { computeProgress, progressToStage } from "@/lib/project-utils"
import { ProjectDetail } from "./project-detail"

export const dynamic = "force-dynamic"

function parseFirstCategory(cat: string | null): string {
  if (!cat) return ""
  try {
    const parsed = JSON.parse(cat)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : typeof parsed === "string" ? parsed : ""
  } catch {
    return cat ?? ""
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const select = {
    id: true,
    title: true,
    slug: true,
    shortDescription: true,
    description: true,
    category: true,
    status: true,
    budget: true,
    startDate: true,
    endDate: true,
    image: true,
    updatedAt: true,
    createdBy: { select: { id: true, name: true, image: true } },
    organization: { select: { name: true, slug: true } },
    contributors: {
      select: {
        role: true,
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    },
    media: {
      select: { id: true, type: true, url: true, title: true, fileType: true },
      orderBy: { createdAt: "desc" },
    },
      milestones: {
        select: { id: true, title: true, description: true, dueDate: true, completed: true, completedAt: true, sortOrder: true, weight: true },
        orderBy: { sortOrder: "asc" },
      },
  }

  let project = await prisma.project.findUnique({ where: { slug: id }, select })

  if (!project) {
    project = await prisma.project.findUnique({ where: { id }, select })
  }

  if (!project) {
    notFound()
  }

  const progress = computeProgress(project.milestones)
  const stage = progressToStage(progress)

  const mapped = {
    id: project.id,
    slug: project.slug,
    title: project.title,
    tagline: project.shortDescription ?? "",
    description: project.description ?? "",
    image: project.image,
    category: parseFirstCategory(project.category),
    status: project.status === "COMPLETED" ? "completed" as const : project.status === "ACTIVE" ? "active" as const : project.status === "CANCELLED" ? "on-hold" as const : "draft" as const,
    progress,
    startDate: project.startDate?.toLocaleDateString("en-US", { month: "short", year: "numeric" }) ?? "",
    targetDate: project.endDate?.toLocaleDateString("en-US", { month: "short", year: "numeric" }) ?? "",
    budget: project.budget ? `$${Number(project.budget).toLocaleString()}` : "",
    innovationAreas: [] as string[],
    organization: project.organization
      ? { name: project.organization.name, logo: null as null, industry: "", website: "" }
      : { name: "", logo: null as null, industry: "", website: "" },
    milestones: project.milestones.map((m) => ({
      id: m.id,
      title: m.title,
      date: m.dueDate?.toLocaleDateString("en-US", { month: "short", year: "numeric" }) ?? "",
      completed: m.completed,
      description: m.description ?? "",
    })),
    contributors: project.contributors.map((c) => ({
      name: c.user.name ?? "Unknown",
      title: c.role,
      avatar: null as null,
      expertise: [] as string[],
    })),
    media: project.media.map((m) => ({
      id: m.id,
      type: m.type,
      title: m.title ?? m.url,
      url: m.url,
      fileType: m.fileType,
    })),
    documents: project.media.filter((m) => m.type === "DOCUMENT").map((m) => ({
      name: m.title ?? m.url,
      type: m.fileType?.toUpperCase() ?? "FILE",
      size: "",
      updatedAt: "",
    })),
    activities: [] as { user: string; action: string; timestamp: string }[],
    stage,
    health: progress === 100 ? "Completed" : "On Track",
    updatedAt: project.updatedAt.toISOString(),
    leadStrategist: project.createdBy?.name ?? project.contributors[0]?.user.name ?? null,
  }

  const session = await auth()
  const isAdmin = session?.user?.role === "ADMIN"

  return <ProjectDetail project={mapped} isAdmin={isAdmin} />
}
