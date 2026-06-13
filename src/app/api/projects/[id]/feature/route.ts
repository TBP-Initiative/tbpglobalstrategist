import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const project = await prisma.project.findUnique({ where: { id } })
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  const now = new Date()
  const isFeatured = !project.isFeatured

  const updated = await prisma.project.update({
    where: { id },
    data: {
      isFeatured,
      featuredAt: isFeatured ? now : null,
    },
    select: {
      id: true,
      isFeatured: true,
      featuredAt: true,
    },
  })

  return NextResponse.json(updated)
}
