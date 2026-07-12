import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripHtml } from "@/lib/project-utils"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const contributions = await prisma.projectContributor.findMany({
      where: { userId },
      select: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            shortDescription: true,
            status: true,
            image: true,
            category: true,
            startDate: true,
            endDate: true,
            createdAt: true,
            _count: { select: { contributors: true, milestones: true } },
            milestones: {
              select: { completed: true },
            },
          },
        },
        role: true,
        joinedAt: true,
      },
      orderBy: { joinedAt: "desc" },
    })

    const projects = contributions.map((c) => {
      const totalMilestones = c.project.milestones.length
      const completedMilestones = c.project.milestones.filter((m) => m.completed).length
      const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

      return {
        id: c.project.id,
        title: c.project.title,
        slug: c.project.slug,
        description: stripHtml(c.project.shortDescription ?? c.project.description ?? ""),
        status: c.project.status.toLowerCase(),
        image: c.project.image,
        category: c.project.category,
        progress,
        contributorCount: c.project._count.contributors,
        role: c.role,
        joinedAt: c.joinedAt.toISOString(),
        startDate: c.project.startDate?.toISOString() ?? null,
        endDate: c.project.endDate?.toISOString() ?? null,
        createdAt: c.project.createdAt.toISOString(),
      }
    })

    return NextResponse.json(projects)
  } catch (err) {
    console.error("My projects fetch error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
