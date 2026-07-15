import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

async function supabaseFetch(url: string, options: RequestInit = {}) {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return fetch(`${supabaseUrl}${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${supabaseKey}`,
      ...(options.headers as Record<string, string> ?? {}),
    },
  })
}

export async function POST() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }

  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, title: true, fileUrl: true, fileType: true },
  })

  const results: { id: string; title: string; status: string; newUrl?: string; error?: string }[] = []

  for (const sub of submissions) {
    const url = sub.fileUrl

    if (!url || url.startsWith("data:")) {
      results.push({ id: sub.id, title: sub.title, status: "skipped", error: "Data URL or empty" })
      continue
    }

    const oldPathMatch = url.match(/\/storage\/v1\/object\/(?:public\/)?projects\/(.+)$/)
    if (!oldPathMatch) {
      results.push({ id: sub.id, title: sub.title, status: "skipped", error: "Not a Supabase projects path" })
      continue
    }

    const oldPath = oldPathMatch[1]
    const ext = oldPath.split(".").pop() ?? "bin"
    const safeName = sub.title.replace(/[^a-zA-Z0-9\s\-_.]/g, "").replace(/\s+/g, "-").slice(0, 80) || `submission-${sub.id}`
    const newPath = `${Date.now()}-${safeName}.${ext}`

    try {
      const dlRes = await supabaseFetch(`/storage/v1/object/projects/${encodeURIComponent(oldPath)}`)
      if (!dlRes.ok) {
        results.push({ id: sub.id, title: sub.title, status: "skipped", error: `Download failed: ${dlRes.status}` })
        continue
      }
      const buffer = Buffer.from(await dlRes.arrayBuffer())

      const upRes = await supabaseFetch(`/storage/v1/object/projects/${newPath}`, {
        method: "POST",
        headers: { "Content-Type": sub.fileType || "application/octet-stream" },
        body: buffer,
      })

      if (!upRes.ok) {
        results.push({ id: sub.id, title: sub.title, status: "skipped", error: `Upload failed: ${upRes.status}` })
        continue
      }

      const newUrl = `${supabaseUrl}/storage/v1/object/public/projects/${newPath}`
      await prisma.submission.update({ where: { id: sub.id }, data: { fileUrl: newUrl } })

      await supabaseFetch(`/storage/v1/object/projects/${encodeURIComponent(oldPath)}`, { method: "DELETE" })

      results.push({ id: sub.id, title: sub.title, status: "migrated", newUrl })
    } catch (err) {
      results.push({ id: sub.id, title: sub.title, status: "error", error: err instanceof Error ? err.message : "Unknown" })
    }
  }

  return NextResponse.json({ total: submissions.length, results })
}
