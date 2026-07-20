import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"
import { createNotification, notifyAdmins } from "@/lib/notifications"

function generateReferralCode(name: string): string {
  const clean = (name || "user").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6)
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `TBP-${clean}-${rand}`
}

const individualRegistrationSchema = registerSchema.extend({
  inviteCode: z.string().optional(),
  referralCode: z.string().optional(),
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

    let referralCode = generateReferralCode(data.name)

    let attempts = 0
    while (attempts < 10) {
      const exists = await prisma.user.findUnique({ where: { referralCode } })
      if (!exists) break
      referralCode = generateReferralCode(data.name + attempts)
      attempts++
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role as any,
        referralCode,
        strategistProfile: data.role === "STRATEGIST"
          ? { create: { stage: "CANDIDATE" } }
          : undefined,
      },
      select: { id: true, name: true },
    })

    if (data.referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: data.referralCode },
      })

      if (referrer && referrer.id !== user.id) {
        await prisma.referral.create({
          data: {
            referrerId: referrer.id,
            referredUserId: user.id,
            code: data.referralCode,
          },
        })
      }
    }

    await createNotification({
      userId: user.id,
      title: "Welcome to TBP Global Strategist",
      message: `Hi ${user.name ?? "there"}! Your account has been created successfully. Your referral code is: ${referralCode}`,
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
