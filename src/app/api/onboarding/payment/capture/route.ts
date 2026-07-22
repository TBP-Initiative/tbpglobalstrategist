import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

async function processPaymentComplete(userId: string, orderId: string, amount: string) {
  await prisma.onboardingSubmission.update({
    where: { userId },
    data: {
      status: "COMPLETED",
      paymentStatus: "COMPLETED",
      paymentReference: orderId,
      paidAt: new Date(),
    },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { role: "STRATEGIST", isActive: true },
  })

  await prisma.strategistProfile.upsert({
    where: { userId },
    create: { userId, stage: "STRATEGIST", title: "TBP Global Strategist Fellow" },
    update: { stage: "STRATEGIST", title: "TBP Global Strategist Fellow" },
  })

  await prisma.notification.create({
    data: {
      userId,
      title: "Welcome to TBP Global Strategist Fellowship!",
      message: "Your payment has been confirmed. You are now a TBP Global Strategist Fellow.",
      type: "SYSTEM",
    },
  })

  const referral = await prisma.referral.findFirst({ where: { referredUserId: userId } })
  if (referral) {
    await prisma.referral.update({ where: { id: referral.id }, data: { status: "PAYMENT_RECEIVED" } })

    const credit = await prisma.referralCredit.findFirst({ where: { referralId: referral.id } })
    if (!credit) {
      await prisma.referralCredit.create({
        data: { userId: referral.referrerId, referralId: referral.id, amount: 50, status: "PENDING" },
      })
      await prisma.notification.create({
        data: {
          userId: referral.referrerId,
          title: "Referral Bonus Pending!",
          message: "Someone you referred has completed payment. Your $50 reward is in a 21-day hold period.",
          type: "SYSTEM",
        },
      })
    }
  }

  return { success: true, amount }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { orderId, testMode } = body

    if (!orderId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 })
    }

    if (testMode) {
      const result = await processPaymentComplete(session.user.id, orderId, "0")
      return NextResponse.json({ ...result, captureId: "TEST-MOCK" })
    }

    const captureRes = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    })

    const captureData = await captureRes.json()

    if (captureData.status !== "COMPLETED") {
      console.error("PayPal capture failed:", captureData)
      return NextResponse.json({ error: "Payment capture failed" }, { status: 400 })
    }

    const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0]
    const amount = capture?.amount?.value

    const result = await processPaymentComplete(session.user.id, orderId, amount || "0")
    return NextResponse.json({ ...result, captureId: capture?.id })
  } catch (err) {
    console.error("POST /api/onboarding/payment/capture error:", err)
    return NextResponse.json({ error: "Payment capture failed" }, { status: 500 })
  }
}
