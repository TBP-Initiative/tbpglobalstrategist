import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"

const corporateRegistrationSchema = registerSchema.extend({
  registrationType: z.literal("corporate"),
  organizationName: z.string().min(2),
  industry: z.string().min(1),
  organizationSize: z.string().min(1),
  inviteCode: z.string().optional(),
  role: z.string().min(1),
})

const individualRegistrationSchema = registerSchema.extend({
  registrationType: z.literal("individual"),
  inviteCode: z.string().optional(),
  role: z.string().min(1),
})

const validationSchema = z.discriminatedUnion("registrationType", [
  individualRegistrationSchema,
  corporateRegistrationSchema,
])

const VALID_ROLES = [
  "STRATEGIST",
  "RESEARCHER",
  "PARTNER",
  "CORPORATE",
  "ORGANIZATION_ADMIN",
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

    if (data.registrationType === "individual") {
      await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
          role: data.role,
        },
        select: { id: true },
      })
    } else {
      const role = data.role as "CORPORATE" | "ORGANIZATION_ADMIN"

      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
          role,
        },
        select: { id: true },
      })

      const slug = data.organizationName
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "")

      const organization = await prisma.organization.create({
        data: {
          name: data.organizationName,
          slug,
          industry: data.industry,
          size: data.organizationSize,
        },
      })

      await prisma.organizationMember.create({
        data: {
          organizationId: organization.id,
          userId: user.id,
          role,
        },
      })
    }

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
