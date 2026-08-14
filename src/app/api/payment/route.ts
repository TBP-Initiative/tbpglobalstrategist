import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const PLANS = {
  STANDARD: {
    amount: 1500,
    name: "TBP Global Strategist Fellowship",
    description: "TBP Global Strategist Fellowship",
  },
  PLUS: {
    amount: 7500,
    name: "Applied R&D & Technology Development",
    description: "Applied R&D & Technology Development",
  },
}

export async function GET() {
  return NextResponse.json({
    paypalClientId: process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || null,
  })
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { pathway } = body

    if (!pathway || !["STANDARD", "PLUS"].includes(pathway)) {
      return NextResponse.json({ error: "Invalid pathway" }, { status: 400 })
    }

    const plan = pathway === "PLUS" ? PLANS.PLUS : PLANS.STANDARD

    let onboarding = await prisma.onboardingSubmission.findUnique({
      where: { userId: session.user.id },
    })

    if (onboarding) {
      if (onboarding.status === "COMPLETED" && onboarding.paymentStatus === "COMPLETED") {
        return NextResponse.json({ error: "You have already completed payment" }, { status: 400 })
      }

      onboarding = await prisma.onboardingSubmission.update({
        where: { userId: session.user.id },
        data: {
          pathway: pathway as "STANDARD" | "PLUS",
          pathwayAmount: plan.amount,
          status: "PENDING_PAYMENT",
        },
      })
    } else {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } })

      onboarding = await prisma.onboardingSubmission.create({
        data: {
          userId: session.user.id,
          fullName: user?.name || session.user.name || "User",
          status: "PENDING_PAYMENT",
          currentStep: 6,
          pathway: pathway as "STANDARD" | "PLUS",
          pathwayAmount: plan.amount,
          agreedToTerms: true,
          agreedToConduct: true,
          agreedToIP: true,
          agreedToPrivacy: true,
          agreedToNoClaim: true,
          agreedToAccurate: true,
          agreedToRefund: true,
        },
      })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.tbpglobalstrategist.com"
    const paypalRes = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: plan.description,
            amount: {
              currency_code: "USD",
              value: String(plan.amount),
            },
          },
        ],
        application_context: {
          return_url: `${appUrl}/dashboard/payment?success=true`,
          cancel_url: `${appUrl}/dashboard/payment?cancelled=true`,
        },
      }),
    })

    const paypalData = await paypalRes.json()

    if (!paypalData.id) {
      console.error("PayPal order creation failed:", paypalData)
      return NextResponse.json({ error: "PayPal order creation failed. Please try again." }, { status: 500 })
    }

    await prisma.onboardingSubmission.update({
      where: { userId: session.user.id },
      data: {
        paymentProvider: "PAYPAL",
        paymentReference: paypalData.id,
        paymentAmount: plan.amount,
        paymentCurrency: "USD",
      },
    })

    return NextResponse.json({
      paypalOrderId: paypalData.id,
      paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      amount: plan.amount,
    })
  } catch (err) {
    console.error("POST /api/payment error:", err)
    return NextResponse.json({ error: "Payment failed. Please try again." }, { status: 500 })
  }
}
