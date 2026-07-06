import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AnalyticsClient } from "./analytics-client"

export default async function AdminAnalyticsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard")

  const [users, projects, orgs, activityLogs, messages] = await Promise.all([
    prisma.user.findMany({ select: { createdAt: true, role: true } }),
    prisma.project.findMany({ select: { createdAt: true, status: true, budget: true } }),
    prisma.organization.count(),
    prisma.activityLog.findMany({ select: { createdAt: true, action: true } }),
    prisma.message.count(),
  ])

  const now = new Date()

  const userGrowth = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1)
    return {
      month: month.toLocaleString("default", { month: "short" }),
      users: users.filter((u) => new Date(u.createdAt) >= month && new Date(u.createdAt) < nextMonth).length,
    }
  })

  const projectTrends = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1)
    const monthProjects = projects.filter((p) => new Date(p.createdAt) >= month && new Date(p.createdAt) < nextMonth)
    return {
      month: month.toLocaleString("default", { month: "short" }),
      created: monthProjects.length,
      completed: monthProjects.filter((p) => p.status === "COMPLETED").length,
    }
  })

  const totalBudget = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0)
  const totalMessages = messages
  const totalActivities = activityLogs.length
  const strategistCount = users.filter((u) => u.role === "STRATEGIST" || u.role === "RESEARCHER").length
  const adminCount = users.filter((u) => u.role === "ADMIN").length
  const projectStatuses = {
    active: projects.filter((p) => p.status === "ACTIVE").length,
    draft: projects.filter((p) => p.status === "DRAFT").length,
    completed: projects.filter((p) => p.status === "COMPLETED").length,
    cancelled: projects.filter((p) => p.status === "CANCELLED").length,
  }

  return (
    <AnalyticsClient
      userGrowth={userGrowth}
      projectTrends={projectTrends}
      stats={{
        totalUsers: users.length,
        strategistCount,
        adminCount,
        totalProjects: projects.length,
        totalOrgs: orgs,
        totalBudget,
        totalMessages,
        totalActivities,
        ...projectStatuses,
      }}
    />
  )
}
