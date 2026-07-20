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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const referrals = await prisma.referral.findMany({
      include: {
        referrer: { select: { id: true, name: true, email: true } },
        referredUser: { select: { id: true, name: true, email: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const credits = await prisma.referralCredit.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const totalPaid = credits.filter((c) => c.status === "PAID").reduce((s, c) => s + Number(c.amount), 0)
    const totalPending = credits.filter((c) => c.status === "PENDING").reduce((s, c) => s + Number(c.amount), 0)

    return NextResponse.json({
      stats: {
        totalReferrals: referrals.length,
        completedReferrals: referrals.filter((r) => r.status === "COMPLETED").length,
        pendingReferrals: referrals.filter((r) => r.status === "PENDING").length,
        totalPaidCredits: totalPaid,
        totalPendingCredits: totalPending,
      },
      referrals: referrals.map((r) => ({
        id: r.id,
        referrerName: r.referrer.name,
        referrerEmail: r.referrer.email,
        referredName: r.referredUser.name,
        referredEmail: r.referredUser.email,
        status: r.status,
        code: r.code,
        createdAt: r.createdAt,
      })),
      credits: credits.map((c) => ({
        id: c.id,
        userName: c.user.name,
        userEmail: c.user.email,
        amount: c.amount,
        status: c.status,
        createdAt: c.createdAt,
      })),
    })
  } catch (err) {
    console.error("GET /api/admin/referrals error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
