import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.strategistProfile.findUnique({
      where: { userId: session.user.id },
      select: { featuredProjectId: true },
    })

    return NextResponse.json({ featuredProjectId: profile?.featuredProjectId ?? null })
  } catch (err) {
    console.error("Featured project fetch error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { projectId } = body

    if (projectId) {
      const isContributor = await prisma.projectContributor.findUnique({
        where: { projectId_userId: { projectId, userId: session.user.id } },
      })
      if (!isContributor) {
        return NextResponse.json({ error: "You are not a contributor to this project" }, { status: 403 })
      }
    }

    await prisma.strategistProfile.upsert({
      where: { userId: session.user.id },
      update: { featuredProjectId: projectId || null },
      create: { userId: session.user.id, featuredProjectId: projectId || null },
    })

    return NextResponse.json({ ok: true, featuredProjectId: projectId || null })
  } catch (err) {
    console.error("Featured project update error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
