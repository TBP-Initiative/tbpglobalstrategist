import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const submissionId = searchParams.get("id")
    if (!submissionId) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }

    const sub = await prisma.submission.findUnique({
      where: { id: submissionId },
      select: { fileUrl: true, title: true, fileType: true },
    })
    if (!sub || !sub.fileUrl) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const safeName = (sub.title || "download").replace(/[^a-zA-Z0-9\s\-_.]/g, "").replace(/\s+/g, "-").slice(0, 80) || "download"

    // Handle base64 data URLs (fallback storage)
    if (sub.fileUrl.startsWith("data:")) {
      const match = sub.fileUrl.match(/^data:[^;]+;base64,(.+)$/)
      if (!match) {
        return NextResponse.json({ error: "Invalid data URL" }, { status: 400 })
      }
      const buffer = Buffer.from(match[1], "base64")
      const mimeType = sub.fileUrl.split(";")[0].split(":")[1] || "application/octet-stream"
      const ext = mimeType.split("/")[1] || "bin"
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": mimeType,
          "Content-Disposition": `attachment; filename="${safeName}.${ext}"`,
          "Content-Length": String(buffer.length),
        },
      })
    }

    // Handle remote URLs (Supabase storage)
    const ext = sub.fileUrl.split(".").pop()?.split("?")[0] ?? "bin"
    const filename = `${safeName}.${ext}`

    const res = await fetch(sub.fileUrl)
    if (!res.ok) {
      return NextResponse.json({ error: "File not available" }, { status: 404 })
    }

    const buffer = Buffer.from(await res.arrayBuffer())

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": sub.fileType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(buffer.length),
      },
    })
  } catch (err) {
    console.error("Download error:", err)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
