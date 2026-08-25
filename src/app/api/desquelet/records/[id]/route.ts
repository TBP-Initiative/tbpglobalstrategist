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
      include: {
        project: { select: { id: true, title: true, slug: true } },
        stages: {
          include: {
            evidence: { orderBy: { createdAt: "desc" } },
            reviews: {
              include: { reviewer: { select: { id: true, name: true, email: true } } },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
          orderBy: { createdAt: "asc" },
        },
        iterations: { orderBy: { createdAt: "desc" } },
        milestones: { orderBy: { version: "desc" } },
      },
    })

    if (!record) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (record.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(record)
  } catch (err) {
    console.error("DESQUELET record fetch error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
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

    const record = await prisma.desqueletRecord.findUnique({
      where: { id },
      select: { id: true, userId: true },
    })

    if (!record) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const isAdmin = session.user.role === "ADMIN"
    if (record.userId !== session.user.id && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data: Record<string, unknown> = {}
    if (body.title !== undefined) data.title = body.title
    if (body.currentRevision !== undefined) data.currentRevision = body.currentRevision
    if (body.visibility !== undefined) data.visibility = body.visibility

    const updated = await prisma.desqueletRecord.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (err) {
    console.error("DESQUELET record update error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const record = await prisma.desqueletRecord.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!record) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.desqueletRecord.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("DESQUELET record delete error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
