import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as Record<string, string>).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = passwordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid password", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true } })
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12)

    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    })

    return NextResponse.json({ message: "Password updated" })
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
