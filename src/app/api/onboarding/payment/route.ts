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
    const { pathway, source } = body

    const onboarding = await prisma.onboardingSubmission.findUnique({
      where: { userId: session.user.id },
    })

    if (!onboarding) {
      return NextResponse.json({ error: "Complete onboarding first" }, { status: 400 })
    }

    const plan = pathway === "PLUS" ? PLANS.PLUS : PLANS.STANDARD

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tbpglobalstrategist.vercel.app"
    const isApply = source === "apply" || onboarding.source === "INSTITUTE_APPLICATION"
    const returnUrl = `${baseUrl}${isApply ? "/apply?step=10" : "/onboarding?step=7"}&provider=paypal`
    const cancelUrl = `${baseUrl}${isApply ? "/apply?step=9" : "/onboarding?step=6"}&cancelled=true`

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
          return_url: returnUrl,
          cancel_url: cancelUrl,
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
        status: "PENDING_PAYMENT",
      },
    })

    return NextResponse.json({
      paypalOrderId: paypalData.id,
      paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      amount: plan.amount,
    })
  } catch (err) {
    console.error("POST /api/onboarding/payment error:", err)
    return NextResponse.json({ error: "Payment failed. Please try again." }, { status: 500 })
  }
}
