import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export const dynamic = "force-dynamic"

function generateReferralCode(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10).toUpperCase() || "USER"
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase()
  return `TBP-${clean}-${rand}`
}

export async function POST() {
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

    const usersWithoutCode = await prisma.user.findMany({
      where: { referralCode: null },
      select: { id: true, name: true },
    })

    let generated = 0
    for (const u of usersWithoutCode) {
      let code = generateReferralCode(u.name || "user")
      let attempts = 0
      while (attempts < 10) {
        const exists = await prisma.user.findUnique({ where: { referralCode: code } })
        if (!exists) break
        code = generateReferralCode((u.name || "user") + attempts)
        attempts++
      }
      await prisma.user.update({
        where: { id: u.id },
        data: { referralCode: code },
      })
      generated++
    }

    return NextResponse.json({ success: true, generated, total: usersWithoutCode.length })
  } catch (err) {
    console.error("POST /api/admin/referrals/generate-codes error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
