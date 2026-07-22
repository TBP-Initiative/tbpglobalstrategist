import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { autoApproveReferralCredits } from "@/lib/referral-utils"

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

    await autoApproveReferralCredits()

    const referrals = await prisma.referral.findMany({
      include: {
        referrer: { select: { id: true, name: true, email: true } },
        referredUser: { select: { id: true, name: true, email: true, createdAt: true } },
        credit: { select: { id: true, amount: true, status: true, paidAt: true, approvedAt: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const credits = await prisma.referralCredit.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const wallets = await prisma.referralWallet.findMany({
      include: { user: { select: { name: true, email: true } } },
    })

    const payoutRequests = await prisma.payoutRequest.findMany({
      include: {
        user: { select: { name: true, email: true } },
        paymentMethod: true,
        auditLogs: { include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    })

    const totalPaid = credits.filter((c) => c.status === "PAID").reduce((s, c) => s + Number(c.amount), 0)
    const totalPending = credits.filter((c) => c.status === "PENDING").reduce((s, c) => s + Number(c.amount), 0)
    const totalApproved = credits.filter((c) => c.status === "APPROVED").reduce((s, c) => s + Number(c.amount), 0)

    return NextResponse.json({
      stats: {
        totalReferrals: referrals.length,
        completedReferrals: referrals.filter((r) => ["WAITING_APPROVAL", "APPROVED", "PAID"].includes(r.status)).length,
        pendingReferrals: referrals.filter((r) => r.status === "PENDING_REGISTRATION").length,
        waitingApproval: referrals.filter((r) => r.status === "WAITING_APPROVAL").length,
        approvedReferrals: referrals.filter((r) => r.status === "APPROVED").length,
        totalPaidCredits: totalPaid,
        totalPendingCredits: totalPending,
        totalApprovedCredits: totalApproved,
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
        credit: r.credit
          ? {
              id: r.credit.id,
              amount: Number(r.credit.amount),
              status: r.credit.status,
              paidAt: r.credit.paidAt,
              approvedAt: r.credit.approvedAt,
            }
          : null,
      })),
      credits: credits.map((c) => ({
        id: c.id,
        userName: c.user.name,
        userEmail: c.user.email,
        amount: Number(c.amount),
        status: c.status,
        createdAt: c.createdAt,
        paidAt: c.paidAt,
        approvedAt: c.approvedAt,
      })),
      wallets: wallets.map((w) => ({
        id: w.id,
        userName: w.user.name,
        userEmail: w.user.email,
        availableBalance: Number(w.availableBalance),
        paidBalance: Number(w.paidBalance),
      })),
      payoutRequests: payoutRequests.map((p) => ({
        id: p.id,
        userName: p.user.name,
        userEmail: p.user.email,
        amount: Number(p.amount),
        method: p.method,
        accountDetails: p.accountDetails,
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
        auditLogs: p.auditLogs.map((log) => ({
          id: log.id,
          action: log.action,
          details: log.details,
          transactionRef: log.transactionRef,
          userName: log.user.name,
          userEmail: log.user.email,
          createdAt: log.createdAt,
        })),
      })),
    })
  } catch (err) {
    console.error("GET /api/admin/referrals error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
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

    const body = await req.json()
    const { action, creditId, payoutRequestId, status } = body

    // Approve credit (move from PENDING to APPROVED after hold period)
    if (action === "approve-credit" && creditId) {
      const credit = await prisma.referralCredit.findUnique({ where: { id: creditId } })
      if (!credit || credit.status !== "PENDING") {
        return NextResponse.json({ error: "Invalid credit" }, { status: 400 })
      }

      await prisma.referralCredit.update({
        where: { id: creditId },
        data: { status: "APPROVED", approvedAt: new Date() },
      })

      // Update referral status
      const referral = await prisma.referral.findFirst({ where: { credit: { id: creditId } } })
      if (referral) {
        await prisma.referral.update({
          where: { id: referral.id },
          data: { status: "APPROVED" },
        })
      }

      // Update wallet
      await prisma.referralWallet.upsert({
        where: { userId: credit.userId },
        create: { userId: credit.userId, availableBalance: Number(credit.amount), paidBalance: 0 },
        update: { availableBalance: { increment: Number(credit.amount) } },
      })

      await prisma.notification.create({
        data: {
          userId: credit.userId,
          title: "Referral Bonus Approved!",
          message: `Your $${Number(credit.amount)} referral bonus has been approved and added to your wallet.`,
          type: "SYSTEM",
        },
      })

      return NextResponse.json({ success: true })
    }

    // Mark credit as paid (from wallet)
    if (action === "mark-paid" && creditId) {
      const credit = await prisma.referralCredit.findUnique({ where: { id: creditId } })
      if (!credit || credit.status !== "APPROVED") {
        return NextResponse.json({ error: "Invalid credit" }, { status: 400 })
      }

      await prisma.referralCredit.update({
        where: { id: creditId },
        data: { status: "PAID", paidAt: new Date() },
      })

      // Update wallet
      await prisma.referralWallet.update({
        where: { userId: credit.userId },
        data: {
          availableBalance: { decrement: Number(credit.amount) },
          paidBalance: { increment: Number(credit.amount) },
        },
      })

      // Update referral status
      const referral = await prisma.referral.findFirst({ where: { credit: { id: creditId } } })
      if (referral) {
        await prisma.referral.update({
          where: { id: referral.id },
          data: { status: "PAID" },
        })
      }

      await prisma.notification.create({
        data: {
          userId: credit.userId,
          title: "Referral Payment Sent!",
          message: `Your referral reward of $${Number(credit.amount)} has been paid out.`,
          type: "SYSTEM",
        },
      })

      return NextResponse.json({ success: true })
    }

    // Revert credit
    if (action === "revert-credit" && creditId) {
      const credit = await prisma.referralCredit.findUnique({ where: { id: creditId } })
      if (!credit) {
        return NextResponse.json({ error: "Invalid credit" }, { status: 400 })
      }

      const revertStatus = credit.status === "PAID" ? "APPROVED" : credit.status === "APPROVED" ? "PENDING" : "PENDING"
      await prisma.referralCredit.update({
        where: { id: creditId },
        data: {
          status: revertStatus,
          paidAt: revertStatus === "APPROVED" ? null : credit.paidAt,
          approvedAt: revertStatus === "PENDING" ? null : credit.approvedAt,
        },
      })

      if (credit.status === "APPROVED") {
        await prisma.referralWallet.update({
          where: { userId: credit.userId },
          data: { availableBalance: { decrement: Number(credit.amount) } },
        })
      }

      const referral = await prisma.referral.findFirst({ where: { credit: { id: creditId } } })
      if (referral) {
        await prisma.referral.update({
          where: { id: referral.id },
          data: { status: revertStatus === "APPROVED" ? "WAITING_APPROVAL" : "WAITING_APPROVAL" },
        })
      }

      return NextResponse.json({ success: true })
    }

    // Process payout request
    if (action === "process-payout" && payoutRequestId) {
      const { transactionRef } = body
      const payout = await prisma.payoutRequest.findUnique({ where: { id: payoutRequestId } })
      if (!payout || payout.status !== "PENDING") {
        return NextResponse.json({ error: "Invalid payout request" }, { status: 400 })
      }

      await prisma.payoutRequest.update({
        where: { id: payoutRequestId },
        data: { status: "PAID", processedAt: new Date(), paidAt: new Date(), processedById: session.user.id, transactionRef: transactionRef || null },
      })

      await prisma.referralWallet.update({
        where: { userId: payout.userId },
        data: {
          availableBalance: { decrement: Number(payout.amount) },
          paidBalance: { increment: Number(payout.amount) },
        },
      })

      await prisma.payoutAuditLog.create({
        data: {
          payoutRequestId,
          userId: session.user.id,
          action: "PAID",
          details: JSON.stringify({ amount: Number(payout.amount), method: payout.method }),
          transactionRef: transactionRef || null,
        },
      })

      await prisma.notification.create({
        data: {
          userId: payout.userId,
          title: "Payout Processed!",
          message: `Your payout of $${Number(payout.amount)} via ${payout.method} has been processed.${transactionRef ? ` Transaction ref: ${transactionRef}` : ""}`,
          type: "SYSTEM",
        },
      })

      return NextResponse.json({ success: true })
    }

    // Reject payout request
    if (action === "reject-payout" && payoutRequestId) {
      const { reason } = body
      const payout = await prisma.payoutRequest.findUnique({ where: { id: payoutRequestId } })
      if (!payout || payout.status !== "PENDING") {
        return NextResponse.json({ error: "Invalid payout request" }, { status: 400 })
      }

      await prisma.payoutRequest.update({
        where: { id: payoutRequestId },
        data: { status: "REJECTED", processedAt: new Date(), processedById: session.user.id },
      })

      await prisma.referralWallet.update({
        where: { userId: payout.userId },
        data: { availableBalance: { increment: Number(payout.amount) } },
      })

      await prisma.payoutAuditLog.create({
        data: {
          payoutRequestId,
          userId: session.user.id,
          action: "REJECTED",
          details: JSON.stringify({ reason: reason || "No reason provided", amount: Number(payout.amount) }),
        },
      })

      await prisma.notification.create({
        data: {
          userId: payout.userId,
          title: "Payout Request Rejected",
          message: `Your payout request of $${Number(payout.amount)} has been rejected.${reason ? ` Reason: ${reason}` : ""} Funds returned to your wallet.`,
          type: "SYSTEM",
        },
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (err) {
    console.error("PATCH /api/admin/referrals error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
