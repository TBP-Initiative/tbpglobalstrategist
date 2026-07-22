import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const MIN_PAYOUT = 100

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const wallet = await prisma.referralWallet.findUnique({
      where: { userId: session.user.id },
    })

    const payoutRequests = await prisma.payoutRequest.findMany({
      where: { userId: session.user.id },
      include: { paymentMethod: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      wallet: wallet
        ? { availableBalance: Number(wallet.availableBalance), paidBalance: Number(wallet.paidBalance) }
        : { availableBalance: 0, paidBalance: 0 },
      minPayout: MIN_PAYOUT,
      payoutRequests: payoutRequests.map((p) => ({
        id: p.id,
        amount: Number(p.amount),
        method: p.method,
        status: p.status,
        transactionRef: p.transactionRef,
        createdAt: p.createdAt,
        processedAt: p.processedAt,
        paidAt: p.paidAt,
        paymentMethod: p.paymentMethod
          ? {
              type: p.paymentMethod.type,
              label: p.paymentMethod.label,
              paypalEmail: p.paymentMethod.paypalEmail,
              accountHolder: p.paymentMethod.accountHolder,
              bankName: p.paymentMethod.bankName,
            }
          : null,
      })),
    })
  } catch (err) {
    console.error("GET /api/referrals/payout error:", err)
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
    const { amount, method, accountDetails, paymentMethodId } = body

    if (!amount || !method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (amount < MIN_PAYOUT) {
      return NextResponse.json({ error: `Minimum payout is $${MIN_PAYOUT}` }, { status: 400 })
    }

    if (!["BANK_TRANSFER", "PAYPAL"].includes(method)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 })
    }

    const wallet = await prisma.referralWallet.findUnique({
      where: { userId: session.user.id },
    })

    if (!wallet || Number(wallet.availableBalance) < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Get payment method details
    let paymentMethodDetails = accountDetails || "{}"
    if (paymentMethodId) {
      const pm = await prisma.paymentMethod.findFirst({
        where: { id: paymentMethodId, userId: session.user.id },
      })
      if (pm) {
        paymentMethodDetails = JSON.stringify({
          type: pm.type,
          paypalEmail: pm.paypalEmail,
          accountHolder: pm.accountHolder,
          bankName: pm.bankName,
          accountNumber: pm.accountNumber,
          routingNumber: pm.routingNumber,
          swiftCode: pm.swiftCode,
          iban: pm.iban,
          country: pm.country,
        })
      }
    }

    // Deduct from available balance immediately
    await prisma.referralWallet.update({
      where: { userId: session.user.id },
      data: { availableBalance: { decrement: amount } },
    })

    const payout = await prisma.payoutRequest.create({
      data: {
        userId: session.user.id,
        paymentMethodId: paymentMethodId || null,
        amount,
        method,
        accountDetails: paymentMethodDetails,
      },
    })

    // Audit trail
    await prisma.payoutAuditLog.create({
      data: {
        payoutRequestId: payout.id,
        userId: session.user.id,
        action: "CREATED",
        details: JSON.stringify({ amount, method }),
      },
    })

    // Notify admins
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    })

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: "New Payout Request",
          message: `A strategist has requested a $${amount} payout via ${method.replace("_", " ")}.`,
          type: "SYSTEM",
          link: "/dashboard/admin/referrals",
        },
      })
    }

    return NextResponse.json({ success: true, payoutId: payout.id })
  } catch (err) {
    console.error("POST /api/referrals/payout error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
