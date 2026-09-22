import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import AssignmentsClient from "./assignments-client"

export const dynamic = "force-dynamic"

export default async function AssessorAssignmentsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard")

  const [students, assessors] = await Promise.all([
    prisma.user.findMany({
      where: { role: { not: "ADMIN" }, isPublishAssessor: false },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        assessorId: true,
        assessor: { select: { id: true, name: true, email: true } },
        strategistProfile: { select: { stage: true } },
        onboarding: { select: { status: true, source: true } },
        _count: { select: { desqueletRecords: true, submissions: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { OR: [{ role: "ADMIN" }, { isPublishAssessor: true }] },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ])

  const serialized = students.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    image: s.image,
    role: s.role,
    createdAt: s.createdAt.toISOString(),
    assessorId: s.assessorId,
    assessor: s.assessor,
    stage: s.strategistProfile?.stage ?? null,
    onboardingStatus: s.onboarding?.status ?? null,
    source: s.onboarding?.source ?? null,
    records: s._count.desqueletRecords,
    submissions: s._count.submissions,
  }))

  return <AssignmentsClient students={serialized} assessors={assessors} />
}
