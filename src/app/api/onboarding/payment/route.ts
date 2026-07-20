import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getStripe, STRIPE_PLANS } from "@/lib/stripe"

export const dynamic = "force-dynamic"

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
    const { provider, pathway } = body

    const onboarding = await prisma.onboardingSubmission.findUnique({
      where: { userId: session.user.id },
    })

    if (!onboarding) {
      return NextResponse.json({ error: "Complete onboarding first" }, { status: 400 })
    }

    const plan = pathway === "PLUS" ? STRIPE_PLANS.PLUS : STRIPE_PLANS.STANDARD

    if (provider === "STRIPE") {
      const stripeSession = await getStripe().checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: plan.currency,
              product_data: {
                name: plan.name,
                description: plan.description,
              },
              unit_amount: plan.amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://tbpglobalstrategist.vercel.app"}/onboarding?step=7&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://tbpglobalstrategist.vercel.app"}/onboarding?step=6&cancelled=true`,
        metadata: {
          userId: session.user.id,
          onboardingId: onboarding.id,
          pathway: pathway || "STANDARD",
        },
      })

      await prisma.onboardingSubmission.update({
        where: { userId: session.user.id },
        data: {
          paymentProvider: "STRIPE",
          paymentReference: stripeSession.id,
          paymentAmount: plan.amount / 100,
          paymentCurrency: "USD",
          status: "PENDING_PAYMENT",
        },
      })

      return NextResponse.json({ url: stripeSession.url })
    }

    if (provider === "PAYPAL") {
      const paypalRes = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
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
                value: String(plan.amount / 100),
              },
            },
          ],
          application_context: {
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://tbpglobalstrategist.vercel.app"}/onboarding?step=7&provider=paypal`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://tbpglobalstrategist.vercel.app"}/onboarding?step=6&cancelled=true`,
          },
        }),
      })

      const paypalData = await paypalRes.json()

      if (!paypalData.id) {
        console.error("PayPal order creation failed:", paypalData)
        return NextResponse.json({ error: "PayPal order creation failed" }, { status: 500 })
      }

      await prisma.onboardingSubmission.update({
        where: { userId: session.user.id },
        data: {
          paymentProvider: "PAYPAL",
          paymentReference: paypalData.id,
          paymentAmount: plan.amount / 100,
          paymentCurrency: "USD",
          status: "PENDING_PAYMENT",
        },
      })

      const approveUrl = paypalData.links?.find((l: { rel: string }) => l.rel === "approve")?.href

      return NextResponse.json({
        paypalOrderId: paypalData.id,
        paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        approveUrl,
        amount: plan.amount / 100,
      })
    }

    return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
  } catch (err) {
    console.error("POST /api/onboarding/payment error:", err)
    return NextResponse.json({ error: "Payment failed" }, { status: 500 })
  }
}
