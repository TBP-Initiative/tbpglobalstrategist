import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export type ApplicationSource = "ONBOARDING" | "INSTITUTE_APPLICATION"

type StepData = Record<string, string | string[] | boolean | number | undefined>

type FlowConfig = {
  source: ApplicationSource
  completeStep: number
  homeLink: string
  welcomeTitle: string
  welcomeMessage: (name: string) => string
}

const FLOWS: Record<ApplicationSource, FlowConfig> = {
  ONBOARDING: {
    source: "ONBOARDING",
    completeStep: 7,
    homeLink: "/onboarding",
    welcomeTitle: "Welcome to TBP Global Strategist",
    welcomeMessage: (name) =>
      `Hi ${name}! Your account has been created. Complete your fellowship agreement to get started.`,
  },
  INSTITUTE_APPLICATION: {
    source: "INSTITUTE_APPLICATION",
    completeStep: 10,
    homeLink: "/apply",
    welcomeTitle: "Welcome to TBP Global Strategist Institute",
    welcomeMessage: (name) =>
      `Hi ${name}! Your account has been created. Complete your application to the TBP Global Strategist Institute to get started.`,
  },
}

function generateReferralCode(name: string): string {
  const clean = (name || "user").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6)
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `TBP-${clean}-${rand}`
}

function mapOnboardingStep(step: number, data: StepData) {
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
      mapped.pathwayAmount = data.pathway === "PLUS" ? 7500 : 1500
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
      if (data.paymentProvider) mapped.paymentProvider = data.paymentProvider
      if (data.paymentReference) mapped.paymentReference = data.paymentReference
      if (data.paymentAmount) mapped.paymentAmount = data.paymentAmount
      break
    case 7:
      mapped.status = "COMPLETED"
      if (data.paymentReference) mapped.paymentReference = data.paymentReference
      if (data.paymentAmount) mapped.paymentAmount = data.paymentAmount
      if (data.paymentProvider) mapped.paymentProvider = data.paymentProvider
      mapped.paidAt = new Date()
      break
  }

  return mapped
}

function mapApplicationStep(step: number, data: StepData) {
  const mapped: Record<string, unknown> = {}

  switch (step) {
    case 1:
      mapped.fullName = data.fullName
      mapped.preferredName = data.preferredName
      break
    case 2:
      mapped.phoneNumber = data.phoneNumber
      mapped.city = data.city
      mapped.country = data.country
      mapped.dateOfBirth = data.dateOfBirth
      mapped.nationality = data.nationality
      mapped.linkedinUrl = data.linkedinUrl
      mapped.currentStatus = data.currentStatus
      break
    case 3:
      mapped.highestQualification = data.highestQualification
      mapped.institution = data.institution
      mapped.fieldOfStudy = data.fieldOfStudy
      if (data.yearsOfExperience !== undefined && data.yearsOfExperience !== "") {
        mapped.yearsOfExperience = parseInt(data.yearsOfExperience as string, 10)
      }
      break
    case 4:
      if (data.areasOfInterest) {
        mapped.areasOfInterest = JSON.stringify(data.areasOfInterest)
      }
      if (data.otherArea) {
        mapped.otherArea = data.otherArea
      }
      break
    case 5:
      mapped.pathway = data.pathway
      mapped.pathwayAmount = data.pathway === "PLUS" ? 7500 : 1500
      break
    case 6:
      mapped.tentativeProjectId = data.tentativeProjectId
      if (Array.isArray(data.secondaryProjectIds) && data.secondaryProjectIds.length > 0) {
        mapped.secondaryProjectIds = JSON.stringify(data.secondaryProjectIds)
      } else {
        mapped.secondaryProjectIds = "[]"
      }
      if (data.tentativeProject) mapped.tentativeProject = data.tentativeProject
      break
    case 7:
      mapped.fellowshipObjectives = data.fellowshipObjectives
      break
    case 8:
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
    case 9:
      mapped.status = "PENDING_PAYMENT"
      if (data.paymentProvider) mapped.paymentProvider = data.paymentProvider
      if (data.paymentReference) mapped.paymentReference = data.paymentReference
      if (data.paymentAmount) mapped.paymentAmount = data.paymentAmount
      break
    case 10:
      mapped.status = "COMPLETED"
      if (data.paymentReference) mapped.paymentReference = data.paymentReference
      if (data.paymentAmount) mapped.paymentAmount = data.paymentAmount
      if (data.paymentProvider) mapped.paymentProvider = data.paymentProvider
      mapped.paidAt = new Date()
      break
  }

  return mapped
}

function mapStepData(source: ApplicationSource, step: number, data: StepData) {
  if (source === "INSTITUTE_APPLICATION") {
    return mapApplicationStep(step, data)
  }
  return mapOnboardingStep(step, data)
}

export async function getApplication(source: ApplicationSource) {
  const slug = source === "INSTITUTE_APPLICATION" ? "apply" : "onboarding"

  try {
    let session
    try {
      session = await auth()
    } catch (authErr) {
      console.error(`GET /api/${slug} auth() error:`, authErr)
      return NextResponse.json({ currentStep: 1, status: "IN_PROGRESS", isLoggedIn: false, source })
    }

    if (!session?.user?.id) {
      return NextResponse.json({ currentStep: 1, status: "IN_PROGRESS", isLoggedIn: false, source })
    }

    const submission = await prisma.onboardingSubmission.findUnique({
      where: { userId: session.user.id },
    })

    if (!submission || submission.source !== source) {
      return NextResponse.json({ currentStep: 1, status: "IN_PROGRESS", isLoggedIn: true, source })
    }

    const result = {
      ...submission,
      areasOfInterest: submission.areasOfInterest ? JSON.parse(submission.areasOfInterest) : [],
      secondaryProjectIds: submission.secondaryProjectIds ? JSON.parse(submission.secondaryProjectIds) : [],
      isLoggedIn: true,
      source,
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error(`GET /api/${slug} error:`, err)
    return NextResponse.json({ error: `Failed to load ${source === "INSTITUTE_APPLICATION" ? "application" : "onboarding"}` }, { status: 500 })
  }
}

export async function postApplication(source: ApplicationSource, step: number, data: StepData) {
  const slug = source === "INSTITUTE_APPLICATION" ? "apply" : "onboarding"
  const flow = FLOWS[source]

  let session
  try {
    session = await auth()
  } catch (authErr) {
    console.error(`POST /api/${slug} auth() error:`, authErr)
    return NextResponse.json({ error: "Authentication failed. Please refresh the page and try again." }, { status: 500 })
  }

  const userId = session?.user?.id

  // Step 1 without session → create account (NO server-side signIn)
  if (step === 1 && !userId) {
    if (!data.email || !data.password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    try {
      const existing = await prisma.user.findFirst({
        where: { email: { equals: data.email as string, mode: "insensitive" } },
        include: { onboarding: true },
      })

      if (existing) {
        if (existing.onboarding && existing.onboarding.status !== "COMPLETED") {
          const passwordValid = await bcrypt.compare(data.password as string, existing.passwordHash || "")
          if (!passwordValid) {
            return NextResponse.json({ error: "Password does not match. Please use the correct password to continue.", needsSignIn: false }, { status: 401 })
          }
          return NextResponse.json({ userId: existing.id, needsSignIn: true, email: data.email, currentStep: existing.onboarding.currentStep || 1 })
        } else {
          return NextResponse.json({ error: "An account with this email already exists. Please log in instead." }, { status: 409 })
        }
      }

      const passwordHash = await bcrypt.hash(data.password as string, 12)
      let referralCode = generateReferralCode((data.fullName as string) || "user")
      let attempts = 0
      while (attempts < 10) {
        const exists = await prisma.user.findUnique({ where: { referralCode } })
        if (!exists) break
        referralCode = generateReferralCode(((data.fullName as string) || "user") + attempts)
        attempts++
      }

      const user = await prisma.user.create({
        data: {
          name: data.fullName as string,
          email: (data.email as string).toLowerCase(),
          passwordHash,
          role: "STRATEGIST",
          isActive: false,
          referralCode,
          strategistProfile: { create: { stage: "CANDIDATE" } },
        },
        select: { id: true, name: true },
      })

      await prisma.notification.create({
        data: {
          userId: user.id,
          title: flow.welcomeTitle,
          message: flow.welcomeMessage(user.name ?? "there"),
          link: flow.homeLink,
        },
      })

      if (data.referralCode) {
        const referrer = await prisma.user.findUnique({
          where: { referralCode: data.referralCode as string },
        })
        if (referrer && referrer.id !== user.id) {
          await prisma.referral.create({
            data: {
              referrerId: referrer.id,
              referredUserId: user.id,
              code: data.referralCode as string,
            },
          })
        }
      }

      const stepData = mapStepData(source, step, data)
      const submission = await prisma.onboardingSubmission.create({
        data: {
          userId: user.id,
          source: flow.source,
          currentStep: step || 1,
          ...stepData,
        },
      })

      return NextResponse.json({
        needsSignIn: true,
        email: data.email,
        ...submission,
        areasOfInterest: submission.areasOfInterest ? JSON.parse(submission.areasOfInterest) : [],
        isLoggedIn: false,
        source,
      })
    } catch (dbErr) {
      console.error(`POST /api/${slug} step1 DB error:`, dbErr)
      return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 })
    }
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const existing = await prisma.onboardingSubmission.findUnique({
      where: { userId },
    })

    let submission

    const stepData = mapStepData(source, step, data)

    if (!existing) {
      submission = await prisma.onboardingSubmission.create({
        data: {
          userId,
          source: flow.source,
          currentStep: step || 1,
          ...stepData,
        },
      })
    } else {
      submission = await prisma.onboardingSubmission.update({
        where: { userId },
        data: {
          source: flow.source,
          currentStep: Math.max(step || existing.currentStep, existing.currentStep),
          ...stepData,
        },
      })
    }

    if (step === flow.completeStep) {
      await prisma.user.update({ where: { id: userId }, data: { isActive: true } })
    }

    const result = {
      ...submission,
      areasOfInterest: submission.areasOfInterest ? JSON.parse(submission.areasOfInterest) : [],
      secondaryProjectIds: submission.secondaryProjectIds ? JSON.parse(submission.secondaryProjectIds) : [],
      isLoggedIn: true,
      source,
    }

    return NextResponse.json(result)
  } catch (dbErr) {
    console.error(`POST /api/${slug} DB error:`, dbErr)
    return NextResponse.json({ error: "Failed to save progress. Please try again." }, { status: 500 })
  }
}
