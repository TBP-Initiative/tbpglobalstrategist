import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminDashboardClient } from "./admin-client"

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard")

  const [userCount, projectCount, orgCount, messages, activityLogs, recentUsers, recentProjects, queueItems] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.organization.count(),
    prisma.message.count(),
    prisma.activityLog.count(),
    prisma.user.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { createdProjects: true } } },
    }),
    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, status: true, budget: true, createdAt: true, createdBy: { select: { name: true } }, organization: { select: { name: true } } },
    }),
    prisma.user.findMany({
      where: { role: "STRATEGIST" },
      take: 4,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true, strategistProfile: { select: { title: true } } },
    }),
  ])

  const strategistCount = await prisma.user.count({ where: { role: "STRATEGIST" } })
  const activeProjects = await prisma.project.count({ where: { status: "ACTIVE" } })
  const completedProjects = await prisma.project.count({ where: { status: "COMPLETED" } })

  const serializedUsers = recentUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    projects: u._count.createdProjects,
    avatar: u.name ? u.name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "U",
  }))

  const serializedProjects = recentProjects.map((p) => ({
    id: p.id,
    title: p.title,
    status: p.status,
    budget: p.budget?.toString() ?? null,
    createdBy: p.createdBy.name ?? "Unknown",
    organization: p.organization?.name ?? null,
  }))

  const serializedQueue = queueItems.map((u) => ({
    id: u.id,
    name: u.name ?? "Unknown",
    expertise: u.strategistProfile?.title ?? "Strategist",
    submitted: Math.floor((Date.now() - new Date(u.createdAt).getTime()) / 86400000) + " days ago",
    status: "pending" as const,
  }))

  return (
    <AdminDashboardClient
      stats={{
        totalUsers: userCount,
        totalOrgs: orgCount,
        totalProjects: projectCount,
        activeProjects,
        completedProjects,
        strategistCount,
        totalMessages: messages,
        totalActivities: activityLogs,
      }}
      users={serializedUsers}
      projects={serializedProjects}
      verificationQueue={serializedQueue}
    />
  )
}
