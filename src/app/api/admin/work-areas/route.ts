import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const DEFAULT_AREAS = [
  "Capital Advisory", "Engineering", "Architecture",
  "AI Automation", "Software Development", "Energy",
  "Maritime", "Logistics", "Policy",
  "Communications", "Regional Development",
]

export async function GET() {
  const session = await auth()
  if (!session?.user || (session.user as Record<string, string>).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  const count = await prisma.workArea.count()

  if (count === 0) {
    const slug = (name: string) =>
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    await prisma.workArea.createMany({
      data: DEFAULT_AREAS.map((name) => ({ name, slug: slug(name) })),
      skipDuplicates: true,
    })
  }

  const areas = await prisma.workArea.findMany({
    orderBy: { name: "asc" },
  })

  return NextResponse.json(areas)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user || (session.user as Record<string, string>).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ message: "Name is required" }, { status: 422 })
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const existing = await prisma.workArea.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ message: "A work area with this name already exists" }, { status: 409 })
    }

    const area = await prisma.workArea.create({
      data: { name: name.trim(), slug },
    })

    return NextResponse.json(area, { status: 201 })
  } catch (error) {
    console.error("Create work area error:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
