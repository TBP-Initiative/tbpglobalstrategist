import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; milestoneId: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id, milestoneId } = await params
  const body = await request.json()
  const { title, description, dueDate, completed, sortOrder, weight } = body

  const milestone = await prisma.milestone.findFirst({
    where: { id: milestoneId, projectId: id },
  })

  if (!milestone) {
    return NextResponse.json({ error: "Milestone not found" }, { status: 404 })
  }

  const updated = await prisma.milestone.update({
    where: { id: milestoneId },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      ...(completed !== undefined && { completed, completedAt: completed ? new Date() : null }),
      ...(sortOrder !== undefined && { sortOrder }),
      ...(weight !== undefined && { weight }),
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string; milestoneId: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id, milestoneId } = await params

  const milestone = await prisma.milestone.findFirst({
    where: { id: milestoneId, projectId: id },
  })

  if (!milestone) {
    return NextResponse.json({ error: "Milestone not found" }, { status: 404 })
  }

  await prisma.milestone.delete({ where: { id: milestoneId } })

  return NextResponse.json({ success: true })
}
