import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const [activeProjects, draftProjects, totalProjects, userContributions, publications, pendingRequests, totalActiveProjects] =
      await Promise.all([
        prisma.project.count({
          where: { contributors: { some: { userId } }, status: "ACTIVE" },
        }),
        prisma.project.count({
          where: { contributors: { some: { userId } }, status: "DRAFT" },
        }),
        prisma.project.count({
          where: { contributors: { some: { userId } } },
        }),
        prisma.projectContributor.findMany({
          where: { userId },
          select: { projectId: true },
        }),
        prisma.publication.count({ where: { authorId: userId } }),
        prisma.message.count({ where: { receiverId: userId, read: false } }),
        prisma.project.count({ where: { status: "ACTIVE" } }),
      ])

    const projectIds = userContributions.map((pc) => pc.projectId)

    const otherContributors = projectIds.length > 0
      ? await prisma.projectContributor.findMany({
          where: { projectId: { in: projectIds }, userId: { not: userId } },
        })
      : []

    const uniqueContributors = new Set(otherContributors.map((c) => c.userId))
    const networkSize = uniqueContributors.size

    const firstOfMonth = new Date()
    firstOfMonth.setDate(1)
    firstOfMonth.setHours(0, 0, 0, 0)

    const newThisMonth = otherContributors.filter((c) => c.joinedAt >= firstOfMonth).length

    const collaborations = otherContributors.length

    return NextResponse.json({
      activeProjects,
      inProgress: activeProjects,
      inDraft: draftProjects,
      totalProjects,
      collaborations,
      pendingRequests,
      networkSize,
      newThisMonth,
      publications,
      totalActiveProjects,
    })
  } catch (err) {
    console.error("Dashboard stats error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
