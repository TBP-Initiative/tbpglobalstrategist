import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { autoApproveReferralCredits } from "@/lib/referral-utils"
import crypto from "crypto"

function generateReferralCode(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10).toUpperCase() || "USER"
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase()
  return `TBP-${clean}-${rand}`
}

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await autoApproveReferralCredits()

    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { referralCode: true, name: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Auto-generate referral code if missing (legacy users)
    if (!user.referralCode) {
      let code = generateReferralCode(user.name || "user")
      let attempts = 0
      while (attempts < 5) {
        const exists = await prisma.user.findUnique({ where: { referralCode: code } })
        if (!exists) break
        code = generateReferralCode((user.name || "user") + attempts)
        attempts++
      }
      await prisma.user.update({
        where: { id: session.user.id },
        data: { referralCode: code },
      })
      user = { ...user, referralCode: code }
    }

    const referrals = await prisma.referral.findMany({
      where: { referrerId: session.user.id },
      include: {
        referredUser: { select: { name: true, email: true, createdAt: true } },
        credit: { select: { id: true, amount: true, status: true, paidAt: true, approvedAt: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const credits = await prisma.referralCredit.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    const wallet = await prisma.referralWallet.findUnique({
      where: { userId: session.user.id },
    })

    const totalEarned = credits
      .filter((c) => c.status === "PAID")
      .reduce((sum, c) => sum + Number(c.amount), 0)

    const totalPending = credits
      .filter((c) => c.status === "PENDING")
      .reduce((sum, c) => sum + Number(c.amount), 0)

    const totalApproved = credits
      .filter((c) => c.status === "APPROVED")
      .reduce((sum, c) => sum + Number(c.amount), 0)

    return NextResponse.json({
      referralCode: user.referralCode,
      referralLink: `https://tbpglobalstrategist.vercel.app/onboarding?ref=${user.referralCode}`,
      totalReferrals: referrals.length,
      completedReferrals: referrals.filter((r) => ["WAITING_APPROVAL", "APPROVED", "PAID"].includes(r.status)).length,
      pendingReferrals: referrals.filter((r) => r.status === "PENDING_REGISTRATION").length,
      qualifiedReferrals: referrals.filter((r) => ["WAITING_APPROVAL", "APPROVED", "PAID"].includes(r.status)).length,
      approvedReferrals: referrals.filter((r) => r.status === "APPROVED").length,
      totalEarned,
      totalPending,
      totalApproved,
      wallet: wallet
        ? {
            availableBalance: Number(wallet.availableBalance),
            paidBalance: Number(wallet.paidBalance),
          }
        : { availableBalance: 0, paidBalance: 0 },
      referrals: referrals.map((r) => ({
        name: r.referredUser.name,
        email: r.referredUser.email,
        status: r.status,
        joinedAt: r.referredUser.createdAt,
        credit: r.credit
          ? {
              amount: Number(r.credit.amount),
              status: r.credit.status,
              paidAt: r.credit.paidAt,
              approvedAt: r.credit.approvedAt,
            }
          : null,
      })),
    })
  } catch (err) {
    console.error("GET /api/onboarding/referral error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { code } = await req.json()

    if (!code) {
      return NextResponse.json({ error: "Referral code required" }, { status: 400 })
    }

    const referrer = await prisma.user.findUnique({
      where: { referralCode: code },
    })

    if (!referrer || referrer.id === session.user.id) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 400 })
    }

    const existing = await prisma.referral.findFirst({
      where: { referredUserId: session.user.id },
    })

    if (existing) {
      return NextResponse.json({ error: "Already referred" }, { status: 400 })
    }

    await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredUserId: session.user.id,
        code,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("POST /api/onboarding/referral error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
