import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const VALID_ROLES = [
  "ADMIN", "STRATEGIST",
  "RESEARCHER", "MODERATOR", "PARTNER",
] as const

const roleSchema = z.object({
  role: z.enum(VALID_ROLES),
})

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
    const parsed = roleSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid role", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } })
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role: parsed.data.role },
      select: { id: true, name: true, email: true, role: true },
    })

    return NextResponse.json({ user: updated, message: "Role updated" })
  } catch (error) {
    console.error("Change role error:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
