import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json().catch(() => ({}))
    const isPublishAssessor = body.isPublishAssessor as boolean | undefined

    if (typeof isPublishAssessor !== "boolean") {
      return NextResponse.json({ error: "isPublishAssessor must be a boolean" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const updated = await prisma.user.update({
      where: { id },
      data: { isPublishAssessor },
    })

    return NextResponse.json({ ok: true, isPublishAssessor: updated.isPublishAssessor })
  } catch (err) {
    console.error("Toggle assessor error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
