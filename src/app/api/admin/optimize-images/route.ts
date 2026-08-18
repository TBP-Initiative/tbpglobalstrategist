import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import sharp from "sharp"

const IMAGE_MAX_WIDTH = 1600
const IMAGE_MAX_HEIGHT = 1600
const IMAGE_QUALITY = 80
const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "gif", "bmp", "tiff", "tif", "svg"])

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

async function listAllObjects(): Promise<{ name: string }[]> {
  const all: { name: string }[] = []
  let offset = 0
  const limit = 100
  while (true) {
    const res = await supabaseFetch(`/storage/v1/object/list/projects?limit=${limit}&offset=${offset}`)
    if (!res.ok) break
    const data = await res.json()
    if (!data || data.length === 0) break
    all.push(...data)
    if (data.length < limit) break
    offset += limit
  }
  return all
}

async function downloadFile(name: string): Promise<Buffer | null> {
  const res = await supabaseFetch(`/storage/v1/object/projects/${encodeURIComponent(name)}`)
  if (!res.ok) return null
  return Buffer.from(await res.arrayBuffer())
}

async function uploadFile(filename: string, buffer: Buffer, mimeType: string): Promise<boolean> {
  const res = await supabaseFetch(`/storage/v1/object/projects/${filename}`, {
    method: "POST",
    headers: { "Content-Type": mimeType },
    body: buffer,
  })
  return res.ok
}

async function deleteFile(name: string): Promise<void> {
  await supabaseFetch(`/storage/v1/object/projects/${encodeURIComponent(name)}`, { method: "DELETE" })
}

async function updateDbReferences(oldUrl: string, newUrl: string) {
  const projects = await prisma.project.findMany({ where: { image: oldUrl } })
  for (const p of projects) {
    await prisma.project.update({ where: { id: p.id }, data: { image: newUrl } })
  }

  const media = await prisma.projectMedia.findMany({ where: { url: oldUrl } })
  for (const m of media) {
    await prisma.projectMedia.update({ where: { id: m.id }, data: { url: newUrl } })
  }

  const submissions = await prisma.submission.findMany({ where: { fileUrl: oldUrl } })
  for (const s of submissions) {
    await prisma.submission.update({ where: { id: s.id }, data: { fileUrl: newUrl } })
  }
}

export async function POST() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  if (!supabaseUrl) {
    return NextResponse.json({ error: "SUPABASE_URL not configured" }, { status: 500 })
  }

  try {
    const objects = await listAllObjects()
    const imageFiles = objects.filter((o) => {
      const ext = o.name.split(".").pop()?.toLowerCase() ?? ""
      return IMAGE_EXTENSIONS.has(ext) && !o.name.endsWith(".webp")
    })

    const results = { total: objects.length, images: imageFiles.length, optimized: 0, skipped: 0, failed: 0, bytesSaved: 0 }

    for (const obj of imageFiles) {
      const oldUrl = `${supabaseUrl}/storage/v1/object/public/projects/${obj.name}`
      const ext = obj.name.split(".").pop()?.toLowerCase() ?? ""
      const baseName = obj.name.slice(0, obj.name.lastIndexOf("."))
      const newFilename = `${baseName}.webp`
      const newUrl = `${supabaseUrl}/storage/v1/object/public/projects/${newFilename}`

      try {
        const buffer = await downloadFile(obj.name)
        if (!buffer) { results.skipped++; continue }

        const originalSize = buffer.length

        if (ext === "gif" || ext === "svg") {
          results.skipped++
          continue
        }

        const optimized = await sharp(buffer)
          .resize(IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: IMAGE_QUALITY })
          .toBuffer()

        if (optimized.length >= originalSize) {
          results.skipped++
          continue
        }

        const uploaded = await uploadFile(newFilename, optimized, "image/webp")
        if (!uploaded) { results.failed++; continue }

        await updateDbReferences(oldUrl, newUrl)
        await deleteFile(obj.name)

        results.optimized++
        results.bytesSaved += originalSize - optimized.length
      } catch {
        results.failed++
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Image optimization failed:", error)
    return NextResponse.json({ error: "Optimization failed" }, { status: 500 })
  }
}
