import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
import { computeProgress, progressToStage } from "@/lib/project-utils"
import { ProjectDetailClient } from "./project-detail-client"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { slug } = await params

  const project = await prisma.project.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      description: true,
      objectives: true,
      strategicRelevance: true,
      status: true,
      budget: true,
      startDate: true,
      endDate: true,
      image: true,
      category: true,
      isFeatured: true,
      createdAt: true,
      updatedAt: true,
      organization: { select: { id: true, name: true, slug: true } },
      createdBy: { select: { id: true, name: true, email: true, image: true } },
      contributors: {
        select: {
          user: { select: { id: true, name: true, email: true, image: true, role: true } },
          role: true,
        },
      },
      media: {
        select: { id: true, type: true, url: true, title: true, fileType: true, fileSize: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
      relations: {
        select: {
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
      },
      milestones: {
        select: { id: true, title: true, description: true, dueDate: true, completed: true, completedAt: true, sortOrder: true, weight: true },
        orderBy: { sortOrder: "asc" },
      },
      _count: { select: { contributors: true, media: true, milestones: true } },
    },
  })

  if (!project) notFound()

  const progress = computeProgress(project.milestones)
  const stage = progressToStage(progress)

  const serialized = {
    ...project,
    budget: project.budget?.toString() ?? null,
    startDate: project.startDate?.toISOString() ?? null,
    endDate: project.endDate?.toISOString() ?? null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    milestones: project.milestones.map((m) => ({
      ...m,
      dueDate: m.dueDate?.toISOString() ?? null,
      completedAt: m.completedAt?.toISOString() ?? null,
    })),
    relations: project.relations.map((r) => ({
      relationType: r.relationType,
      relatedProject: {
        ...r.relatedProject,
        shortDescription: r.relatedProject.shortDescription,
      },
    })),
    progress,
    stage,
  }

  const relatedProjects = project.relations.map((r) => r.relatedProject)

  return (
    <ProjectDetailClient
      project={serialized}
      relatedProjects={relatedProjects}
      isAdmin={session.user.role === "ADMIN"}
    />
  )
}
