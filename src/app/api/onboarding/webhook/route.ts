import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const sig = req.headers.get("stripe-signature")

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      const userId = session.metadata?.userId

      if (userId) {
        await prisma.onboardingSubmission.update({
          where: { userId },
          data: {
            status: "COMPLETED",
            paymentStatus: "COMPLETED",
            paidAt: new Date(),
          },
        })

        // Auto-progress user to STRATEGIST stage
        await prisma.user.update({
          where: { id: userId },
          data: { role: "STRATEGIST" },
        })

        await prisma.strategistProfile.upsert({
          where: { userId },
          create: {
            userId,
            stage: "STRATEGIST",
            title: "TBP Global Strategist Fellow",
          },
          update: {
            stage: "STRATEGIST",
            title: "TBP Global Strategist Fellow",
          },
        })

        await prisma.notification.create({
          data: {
            userId,
            title: "Welcome to TBP Global Strategist Fellowship!",
            message: "Your payment has been confirmed. You are now a TBP Global Strategist Fellow.",
            type: "SYSTEM",
          },
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Webhook error:", err)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
