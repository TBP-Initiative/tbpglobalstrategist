import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createNotification } from "@/lib/notifications"

export const dynamic = "force-dynamic"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") return null
  return session
}

export async function GET() {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

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

    return NextResponse.json({ students: serialized, assessors })
  } catch (err) {
    console.error("Assessor assignments fetch error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { userId, assessorId } = body as { userId?: string; assessorId?: string | null }

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 422 })
    }

    const student = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    })

    if (!student) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (student.role === "ADMIN") {
      return NextResponse.json({ error: "Cannot assign an assessor to an admin" }, { status: 422 })
    }

    if (assessorId) {
      const assessor = await prisma.user.findFirst({
        where: { id: assessorId, OR: [{ role: "ADMIN" }, { isPublishAssessor: true }] },
        select: { id: true, name: true },
      })
      if (!assessor) {
        return NextResponse.json({ error: "Selected assessor is not valid" }, { status: 422 })
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { assessorId: assessorId || null },
      select: { id: true, assessorId: true, assessor: { select: { id: true, name: true, email: true } } },
    })

    if (assessorId) {
      await createNotification({
        userId,
        title: "Assessor assigned",
        message: `${updated.assessor?.name ?? "An assessor"} has been assigned as your assessor.`,
        link: "/dashboard/individual",
      })
    }

    return NextResponse.json(updated)
  } catch (err) {
    console.error("Assessor assignment update error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
