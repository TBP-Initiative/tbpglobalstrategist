import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q") ?? ""
  const exclude = searchParams.get("exclude")

  const projects = await prisma.project.findMany({
    where: {
      title: { contains: q },
      ...(exclude ? { id: { not: exclude } } : {}),
    },
    select: {
      id: true,
      title: true,
      slug: true,
      image: true,
      category: true,
      status: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return NextResponse.json(projects)
}
