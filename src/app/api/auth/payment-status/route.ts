import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ hasPaid: false })
    }

    const onboarding = await prisma.onboardingSubmission.findUnique({
      where: { userId: session.user.id },
      select: { paymentStatus: true },
    })

    return NextResponse.json({
      hasPaid: onboarding?.paymentStatus === "COMPLETED",
    })
  } catch {
    return NextResponse.json({ hasPaid: false })
  }
}
