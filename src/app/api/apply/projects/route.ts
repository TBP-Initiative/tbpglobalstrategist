import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

function parseFirstCategory(cat: string | null): string {
  if (!cat) return ""
  try {
    const parsed = JSON.parse(cat)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : typeof parsed === "string" ? parsed : ""
  } catch {
    return cat
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#x2F;/g, "/")
}

export async function GET(request: NextRequest) {
  const pathway = request.nextUrl.searchParams.get("pathway")

  const eligibleValues: string[] =
    pathway === "PLUS"
      ? ["BOTH", "APPLIED_RD"]
      : pathway === "STANDARD"
        ? ["BOTH", "FELLOWSHIP"]
        : []

  try {
    const projects = await prisma.project.findMany({
      where: {
        status: "ACTIVE",
        ...(eligibleValues.length > 0
          ? { eligiblePathways: { in: eligibleValues } }
          : {}),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        description: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(
      projects.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.shortDescription ?? (p.description ? stripHtml(p.description) : ""),
        category: parseFirstCategory(p.category),
      }))
    )
  } catch (err) {
    console.error("GET /api/apply/projects error:", err)
    return NextResponse.json({ error: "Failed to load projects" }, { status: 500 })
  }
}
