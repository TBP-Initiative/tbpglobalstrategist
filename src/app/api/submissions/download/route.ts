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
    if (!sub) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const ext = sub.fileUrl.split(".").pop()?.split("?")[0] ?? "bin"
    const safeName = sub.title.replace(/[^a-zA-Z0-9\s\-_.]/g, "").replace(/\s+/g, "-").slice(0, 80) || "download"
    const filename = `${safeName}.${ext}`

    const res = await fetch(sub.fileUrl)
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch file" }, { status: 502 })
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
