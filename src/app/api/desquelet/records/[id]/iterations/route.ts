import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const record = await prisma.desqueletRecord.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!record || (record.userId !== session.user.id && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const iterations = await prisma.desqueletIteration.findMany({
      where: { recordId: id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(iterations)
  } catch (err) {
    console.error("DESQUELET iterations fetch error:", err)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { fromStage, toStage, reason } = body

    const record = await prisma.desqueletRecord.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!record || record.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (!fromStage || !toStage || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 422 })
    }

    const iteration = await prisma.desqueletIteration.create({
      data: {
        recordId: id,
        fromStage,
        toStage,
        reason,
      },
    })

    return NextResponse.json(iteration, { status: 201 })
  } catch (err) {
    console.error("DESQUELET iteration creation error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
