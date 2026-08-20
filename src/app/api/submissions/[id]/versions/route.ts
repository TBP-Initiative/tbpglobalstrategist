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

    const submission = await prisma.submission.findUnique({
      where: { id },
      select: { id: true, parentSubmissionId: true, projectId: true, userId: true },
    })

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    let rootId = id
    let current = submission
    while (current.parentSubmissionId) {
      rootId = current.parentSubmissionId
      const parent = await prisma.submission.findUnique({
        where: { id: current.parentSubmissionId },
        select: { id: true, parentSubmissionId: true },
      })
      if (!parent) break
      current = parent
    }

    const allVersions = await prisma.submission.findMany({
      where: {
        OR: [
          { id: rootId },
          { parentSubmissionId: rootId },
        ],
      },
      orderBy: { version: "asc" },
      select: {
        id: true,
        version: true,
        title: true,
        status: true,
        changelog: true,
        createdAt: true,
        isLatest: true,
        fileSize: true,
        fileType: true,
      },
    })

    const deeper = await prisma.submission.findMany({
      where: { parentSubmissionId: { in: allVersions.map((v) => v.id) } },
      orderBy: { version: "asc" },
      select: {
        id: true,
        version: true,
        title: true,
        status: true,
        changelog: true,
        createdAt: true,
        isLatest: true,
        fileSize: true,
        fileType: true,
        parentSubmissionId: true,
      },
    })

    const all = [...allVersions, ...deeper].sort((a, b) => a.version - b.version)
    const seen = new Set<string>()
    const unique = all.filter((v) => { if (seen.has(v.id)) return false; seen.add(v.id); return true })

    return NextResponse.json(unique)
  } catch (err) {
    console.error("Versions fetch error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
