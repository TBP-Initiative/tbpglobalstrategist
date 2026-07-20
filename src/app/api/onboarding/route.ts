import { NextResponse } from "next/server"
import { auth, signIn } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic"

function generateReferralCode(name: string): string {
  const clean = (name || "user").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6)
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `TBP-${clean}-${rand}`
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ currentStep: 1, status: "IN_PROGRESS", isLoggedIn: false })
    }

    const onboarding = await prisma.onboardingSubmission.findUnique({
      where: { userId: session.user.id },
    })

    if (!onboarding) {
      return NextResponse.json({ currentStep: 1, status: "IN_PROGRESS", isLoggedIn: true })
    }

    const result = {
      ...onboarding,
      areasOfInterest: onboarding.areasOfInterest ? JSON.parse(onboarding.areasOfInterest) : [],
      isLoggedIn: true,
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error("GET /api/onboarding error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const body = await req.json()
    const { step, ...data } = body

    let userId = session?.user?.id

    // Step 1 without session → create account + sign in
    if (step === 1 && !userId) {
      if (!data.email || !data.password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
      }

      const existing = await prisma.user.findUnique({
        where: { email: data.email },
      })

      if (existing) {
        return NextResponse.json({ error: "An account with this email already exists. Please log in instead." }, { status: 409 })
      }

      const passwordHash = await bcrypt.hash(data.password, 12)
      let referralCode = generateReferralCode(data.fullName || "user")
      let attempts = 0
      while (attempts < 10) {
        const exists = await prisma.user.findUnique({ where: { referralCode } })
        if (!exists) break
        referralCode = generateReferralCode((data.fullName || "user") + attempts)
        attempts++
      }

      const user = await prisma.user.create({
        data: {
          name: data.fullName,
          email: data.email,
          passwordHash,
          role: "STRATEGIST",
          referralCode,
          strategistProfile: { create: { stage: "CANDIDATE" } },
        },
        select: { id: true, name: true },
      })

      await prisma.notification.create({
        data: {
          userId: user.id,
          title: "Welcome to TBP Global Strategist",
          message: `Hi ${user.name ?? "there"}! Your account has been created. Complete your fellowship agreement to get started.`,
          link: "/onboarding",
        },
      })

      // Handle referral code
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

      // Auto sign in
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        return NextResponse.json({
          message: "Account created. Please log in to continue.",
          userId: user.id,
        })
      }

      userId = user.id
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existing = await prisma.onboardingSubmission.findUnique({
      where: { userId },
    })

    let submission

    const stepData = mapStepData(step, data)

    if (!existing) {
      submission = await prisma.onboardingSubmission.create({
        data: {
          userId,
          currentStep: step || 1,
          ...stepData,
        },
      })
    } else {
      submission = await prisma.onboardingSubmission.update({
        where: { userId },
        data: {
          currentStep: Math.max(step || existing.currentStep, existing.currentStep),
          ...stepData,
        },
      })
    }

    const result = {
      ...submission,
      areasOfInterest: submission.areasOfInterest ? JSON.parse(submission.areasOfInterest) : [],
      isLoggedIn: true,
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error("POST /api/onboarding error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

function mapStepData(step: number, data: Record<string, unknown>) {
  const mapped: Record<string, unknown> = {}

  switch (step) {
    case 1:
      mapped.fullName = data.fullName
      mapped.preferredName = data.preferredName
      mapped.phoneNumber = data.phoneNumber
      mapped.city = data.city
      mapped.country = data.country
      mapped.linkedinUrl = data.linkedinUrl
      mapped.currentStatus = data.currentStatus
      if (data.areasOfInterest) {
        mapped.areasOfInterest = JSON.stringify(data.areasOfInterest)
      }
      if (data.otherArea) {
        mapped.otherArea = data.otherArea
      }
      if (data.referredBy) {
        mapped.referredBy = data.referredBy
      }
      break
    case 2:
      break
    case 3:
      mapped.pathway = data.pathway
      mapped.pathwayAmount = data.pathway === "PLUS" ? 1500 : 1200
      break
    case 5:
      mapped.signatureName = data.signatureName
      mapped.agreedToTerms = data.agreedToTerms
      mapped.agreedToConduct = data.agreedToConduct
      mapped.agreedToIP = data.agreedToIP
      mapped.agreedToPrivacy = data.agreedToPrivacy
      mapped.agreedToNoClaim = data.agreedToNoClaim
      mapped.agreedToAccurate = data.agreedToAccurate
      mapped.agreedToRefund = data.agreedToRefund
      mapped.profileVisibility = data.profileVisibility
      break
    case 6:
      mapped.status = "PENDING_PAYMENT"
      break
    case 7:
      mapped.status = "COMPLETED"
      break
  }

  return mapped
}
