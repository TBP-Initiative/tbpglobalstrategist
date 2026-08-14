import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ inactive: false })
    }

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { isActive: true, onboarding: { select: { source: true } } },
    })

    if (user && !user.isActive) {
      return NextResponse.json({ inactive: true, source: user.onboarding?.source || "ONBOARDING" })
    }

    return NextResponse.json({ inactive: false })
  } catch {
    return NextResponse.json({ inactive: false })
  }
}
