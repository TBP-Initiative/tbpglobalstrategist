import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"
import { createNotification, notifyAdmins } from "@/lib/notifications"

const individualRegistrationSchema = registerSchema.extend({
  inviteCode: z.string().optional(),
  role: z.string().min(1),
})

const validationSchema = individualRegistrationSchema

const VALID_ROLES = [
  "STRATEGIST",
  "RESEARCHER",
  "PARTNER",
] as const

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = validationSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 422 }
      )
    }

    const data = parsed.data

    if (!VALID_ROLES.includes(data.role as typeof VALID_ROLES[number])) {
      return NextResponse.json(
        { message: "Invalid role selected" },
        { status: 422 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role as any,
        strategistProfile: data.role === "STRATEGIST"
          ? { create: { stage: "CANDIDATE" } }
          : undefined,
      },
      select: { id: true, name: true },
    })

    await createNotification({
      userId: user.id,
      title: "Welcome to TBP Global Strategist",
      message: `Hi ${user.name ?? "there"}! Your account has been created successfully.`,
      link: "/dashboard",
    })

    await notifyAdmins({
      title: "New user registered",
      message: `${user.name ?? "Someone"} registered as a ${data.role}.`,
      link: "/dashboard/admin",
    })

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
