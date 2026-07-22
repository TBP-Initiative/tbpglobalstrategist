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
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      wallet: wallet
        ? {
            availableBalance: Number(wallet.availableBalance),
            paidBalance: Number(wallet.paidBalance),
          }
        : { availableBalance: 0, paidBalance: 0 },
      minPayout: MIN_PAYOUT,
      payoutRequests: payoutRequests.map((p) => ({
        id: p.id,
        amount: Number(p.amount),
        method: p.method,
        status: p.status,
        createdAt: p.createdAt,
        processedAt: p.processedAt,
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
    const { amount, method, accountDetails } = body

    if (!amount || !method || !accountDetails) {
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

    // Deduct from available balance immediately
    await prisma.referralWallet.update({
      where: { userId: session.user.id },
      data: { availableBalance: { decrement: amount } },
    })

    const payout = await prisma.payoutRequest.create({
      data: {
        userId: session.user.id,
        amount,
        method,
        accountDetails: typeof accountDetails === "string" ? accountDetails : JSON.stringify(accountDetails),
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
