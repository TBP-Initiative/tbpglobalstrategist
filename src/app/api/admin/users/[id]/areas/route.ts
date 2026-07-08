import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createNotification } from "@/lib/notifications"

const areasSchema = z.object({
  workAreaIds: z.array(z.string()),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user || (session.user as Record<string, string>).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  const { id } = await params

  const assignments = await prisma.userWorkArea.findMany({
    where: { userId: id },
    select: {
      workArea: { select: { id: true, name: true, slug: true } },
    },
  })

  return NextResponse.json(assignments.map((a) => a.workArea))
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as Record<string, string>).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = areasSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const { workAreaIds } = parsed.data

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const areas = await prisma.workArea.findMany({
      where: { id: { in: workAreaIds } },
      select: { id: true, name: true },
    })

    if (areas.length !== workAreaIds.length) {
      return NextResponse.json({ message: "One or more work areas not found" }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.userWorkArea.deleteMany({ where: { userId: id } }),
      ...workAreaIds.map((workAreaId) =>
        prisma.userWorkArea.create({ data: { userId: id, workAreaId } })
      ),
    ])

    if (areas.length > 0) {
      const areaNames = areas.map((a) => a.name).join(", ")
      await createNotification({
        userId: id,
        title: "Work Areas Assigned",
        message: `You have been assigned to work on: ${areaNames}.`,
        link: "/dashboard",
      })
    }

    return NextResponse.json({ message: "Work areas updated", areas })
  } catch (error) {
    console.error("Update user areas error:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
