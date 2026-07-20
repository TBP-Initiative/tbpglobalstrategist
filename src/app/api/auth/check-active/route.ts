import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ inactive: false })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { isActive: true },
    })

    if (user && !user.isActive) {
      return NextResponse.json({ inactive: true })
    }

    return NextResponse.json({ inactive: false })
  } catch {
    return NextResponse.json({ inactive: false })
  }
}
