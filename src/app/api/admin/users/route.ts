import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const VALID_ROLES = [
  "ADMIN",
  "STRATEGIST",
  "RESEARCHER",
  "MODERATOR",
  "PARTNER",
] as const

const addUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(VALID_ROLES),
  organizationName: z.string().optional(),
  industry: z.string().optional(),
  organizationSize: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as Record<string, string>).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const parsed = addUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const data = parsed.data

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json(
        { message: "A user with this email already exists" },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash, role: data.role },
      select: { id: true, name: true, email: true, role: true },
    })

    if (data.role === "STRATEGIST" || data.role === "RESEARCHER") {
      await prisma.strategistProfile.create({
        data: { userId: user.id, title: "Strategist", bio: "" },
      })
    }

    return NextResponse.json({ user, message: "User created" }, { status: 201 })
  } catch (error) {
    console.error("Add user error:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
