import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    select: { category: true },
    where: { category: { not: null } },
  })

  const defaults = [
    "City & Regional Development",
    "Event Systems & Global Engagements",
    "Infrastructure Systems",
    "NPNGS Protocols",
    "Software & Digital Platforms",
    "Sovereign & Multipolar Initiatives",
  ]

  const all = new Set(defaults)
  for (const p of projects) {
    if (!p.category) continue
    try {
      const parsed = JSON.parse(p.category)
      if (Array.isArray(parsed)) parsed.forEach((c: string) => { if (c) all.add(c) })
      else if (typeof parsed === "string") all.add(parsed)
    } catch {
      if (typeof p.category === "string") all.add(p.category)
    }
  }

  return NextResponse.json(Array.from(all).sort())
}
