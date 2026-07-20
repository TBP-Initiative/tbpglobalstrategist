import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const onboarding = await prisma.onboardingSubmission.findUnique({
      where: { userId: session.user.id },
    })

    return NextResponse.json(onboarding || { currentStep: 1, status: "IN_PROGRESS" })
  } catch (err) {
    console.error("GET /api/onboarding error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { step, ...data } = body

    const existing = await prisma.onboardingSubmission.findUnique({
      where: { userId: session.user.id },
    })

    let submission

    if (!existing) {
      submission = await prisma.onboardingSubmission.create({
        data: {
          userId: session.user.id,
          currentStep: step || 1,
          ...mapStepData(step, data),
        },
      })
    } else {
      const updateData: Record<string, unknown> = {
        currentStep: step || existing.currentStep,
        ...mapStepData(step, data),
      }

      if (step === 2) {
        updateData.fullName = data.fullName || existing.fullName
        updateData.preferredName = data.preferredName || existing.preferredName
        updateData.phoneNumber = data.phoneNumber || existing.phoneNumber
        updateData.city = data.city || existing.city
        updateData.country = data.country || existing.country
        updateData.linkedinUrl = data.linkedinUrl || existing.linkedinUrl
        updateData.currentStatus = data.currentStatus || existing.currentStatus
      }

      submission = await prisma.onboardingSubmission.update({
        where: { userId: session.user.id },
        data: updateData,
      })
    }

    return NextResponse.json(submission)
  } catch (err) {
    console.error("POST /api/onboarding error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

function mapStepData(step: number, data: Record<string, unknown>) {
  const mapped: Record<string, unknown> = {}

  switch (step) {
    case 2:
      mapped.fullName = data.fullName
      mapped.preferredName = data.preferredName
      mapped.phoneNumber = data.phoneNumber
      mapped.city = data.city
      mapped.country = data.country
      mapped.linkedinUrl = data.linkedinUrl
      mapped.currentStatus = data.currentStatus
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
