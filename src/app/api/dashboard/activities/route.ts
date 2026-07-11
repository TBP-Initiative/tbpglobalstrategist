import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const actionLabels: Record<string, string> = {
  CREATE: "created",
  UPDATE: "updated",
  DELETE: "deleted",
  LOGIN: "logged in",
  JOIN_PROJECT: "joined project",
  LEAVE_PROJECT: "left project",
  PUBLISH: "published",
  JOIN_ORGANIZATION: "joined organization",
  LEAVE_ORGANIZATION: "left organization",
  LOGOUT: "logged out",
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const [activityLogs, recentProjects] = await Promise.all([
      prisma.activityLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.projectContributor.findMany({
        where: { userId },
        select: {
          project: {
            select: {
              id: true,
              title: true,
              createdAt: true,
              status: true,
            },
          },
          joinedAt: true,
        },
        orderBy: { joinedAt: "desc" },
        take: 10,
      }),
    ])

    const activities: {
      id: string
      type: string
      title: string
      description: string
      timestamp: string
    }[] = []

    for (const log of activityLogs) {
      let entityName = log.entity ?? ""
      if (log.entity === "Project" && log.entityId) {
        const project = await prisma.project.findUnique({
          where: { id: log.entityId },
          select: { title: true },
        })
        entityName = project?.title ?? entityName
      }

      activities.push({
        id: log.id,
        type: log.action.toLowerCase().includes("project")
          ? "project_created"
          : log.action.toLowerCase().includes("join")
            ? "collaboration"
            : log.action === "PUBLISH"
              ? "publication"
              : "profile_update",
        title: `${actionLabels[log.action] ?? log.action.toLowerCase()} ${log.entity ?? ""}`.trim(),
        description: entityName ? `${log.action.toLowerCase()} ${entityName}` : actionLabels[log.action] ?? log.action,
        timestamp: log.createdAt.toISOString(),
      })
    }

    if (activities.length < 10) {
      for (const rp of recentProjects) {
        if (activities.length >= 15) break
        const exists = activities.some(
          (a) => a.description.includes(rp.project.title)
        )
        if (!exists) {
          activities.push({
            id: `project-${rp.project.id}`,
            type: rp.project.status === "COMPLETED" ? "project_completed" : "project_created",
            title: rp.project.status === "COMPLETED" ? "Project completed" : "Joined project",
            description: rp.project.title,
            timestamp: rp.joinedAt.toISOString(),
          })
        }
      }
    }

    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json(activities.slice(0, 20))
  } catch (err) {
    console.error("Activities fetch error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
