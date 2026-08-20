import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import AdminSubmissionsClient from "./submissions-client"

export const dynamic = "force-dynamic"

export default async function AdminSubmissionsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user || (user.role !== "ADMIN" && !user.isPublishAssessor)) redirect("/dashboard")

  const submissions = await prisma.submission.findMany({
    where: { isLatest: true },
    include: {
      user: { select: { id: true, name: true, email: true } },
      project: { select: { id: true, name: true } },
      revisions: {
        select: { id: true, version: true, title: true, status: true, createdAt: true, changelog: true },
        orderBy: { version: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const serialized = submissions.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    revisions: s.revisions.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
  }))

  return <AdminSubmissionsClient submissions={serialized} isAdmin={user.role === "ADMIN"} />
}
