import { prisma } from "@/lib/prisma"

const HOLD_PERIOD_DAYS = 14

export async function autoApproveReferralCredits() {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - HOLD_PERIOD_DAYS)

  const staleCredits = await prisma.referralCredit.findMany({
    where: {
      status: "PENDING",
      createdAt: { lte: cutoff },
    },
  })

  for (const credit of staleCredits) {
    await prisma.referralCredit.update({
      where: { id: credit.id },
      data: { status: "APPROVED", approvedAt: new Date() },
    })

    await prisma.referralWallet.upsert({
      where: { userId: credit.userId },
      create: { userId: credit.userId, availableBalance: Number(credit.amount), paidBalance: 0 },
      update: { availableBalance: { increment: Number(credit.amount) } },
    })

    const referral = await prisma.referral.findFirst({ where: { credit: { id: credit.id } } })
    if (referral) {
      await prisma.referral.update({
        where: { id: referral.id },
        data: { status: "APPROVED" },
      })
    }

    await prisma.notification.create({
      data: {
        userId: credit.userId,
        title: "Referral Bonus Approved!",
        message: `Your $${Number(credit.amount)} referral bonus has been approved and added to your wallet. You can now request a payout.`,
        type: "SYSTEM",
      },
    })
  }
}
