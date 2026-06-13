import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const milestones = await prisma.milestone.findMany({
    where: { projectId: id },
    orderBy: { sortOrder: "asc" },
  })
  return NextResponse.json(milestones)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { title, description, dueDate, completed, sortOrder, weight } = body

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Title is required" }, { status: 422 })
  }

  const milestone = await prisma.milestone.create({
    data: {
      projectId: id,
      title,
      description: description ?? null,
      dueDate: dueDate ? new Date(dueDate) : null,
      completed: completed ?? false,
      completedAt: completed ? new Date() : null,
      sortOrder: sortOrder ?? 0,
      weight: weight ?? 1,
    },
  })

  return NextResponse.json(milestone, { status: 201 })
}
