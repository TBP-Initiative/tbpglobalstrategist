import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { UsersClient } from "./users-client"

export default async function AdminUsersPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard")

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        strategistProfile: { select: { stage: true } },
        _count: { select: { createdProjects: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
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
  }))

  return <UsersClient users={serialized} total={totalUsers} />
}
