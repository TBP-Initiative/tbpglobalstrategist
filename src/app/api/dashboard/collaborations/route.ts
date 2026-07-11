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

    const userContributions = await prisma.projectContributor.findMany({
      where: { userId },
      select: { projectId: true },
    })

    const projectIds = userContributions.map((c) => c.projectId)

    if (projectIds.length === 0) {
      return NextResponse.json([])
    }

    const otherContributors = await prisma.projectContributor.findMany({
      where: {
        projectId: { in: projectIds },
        userId: { not: userId },
      },
      select: {
        id: true,
        role: true,
        joinedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            strategistProfile: {
              select: {
                title: true,
                sector: true,
                stage: true,
              },
            },
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    })

    const seen = new Set<string>()
    const collaborations = otherContributors
      .filter((c) => {
        if (seen.has(c.user.id)) return false
        seen.add(c.user.id)
        return true
      })
      .map((c) => ({
        id: c.id,
        userId: c.user.id,
        name: c.user.name ?? "Unknown",
        image: c.user.image ?? "",
        title: c.user.strategistProfile?.title ?? "Strategist",
        sector: c.user.strategistProfile?.sector ?? null,
        stage: c.user.strategistProfile?.stage ?? "CANDIDATE",
        projectRole: c.role,
        projectName: c.project.title,
        joinedAt: c.joinedAt.toISOString(),
      }))

    return NextResponse.json(collaborations)
  } catch (err) {
    console.error("Collaborations fetch error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
