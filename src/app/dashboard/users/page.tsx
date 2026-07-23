import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { UsersClient } from "./users-client"

export default async function AdminUsersPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard")

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        isActive: true,
        createdAt: true,
        strategistProfile: { select: { stage: true } },
        workAreaAssignments: {
          select: { workArea: { select: { id: true, name: true, slug: true } } },
        },
        _count: { select: { createdProjects: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where: { isActive: true } }),
  ])

  const serialized = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    image: u.image,
    createdAt: u.createdAt.toISOString(),
    projects: u._count.createdProjects,
    stage: u.strategistProfile?.stage ?? null,
    workAreas: u.workAreaAssignments.map((a) => a.workArea.name),
  }))

  return <UsersClient users={serialized} total={totalUsers} />
}
