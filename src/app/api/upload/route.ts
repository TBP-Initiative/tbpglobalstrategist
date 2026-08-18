import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import sharp from "sharp"

const IMAGE_MAX_WIDTH = 1600
const IMAGE_MAX_HEIGHT = 1600
const IMAGE_QUALITY = 80

async function optimizeImage(buffer: Buffer, mimeType: string): Promise<{ buffer: Buffer; mimeType: string; ext: string }> {
  if (!mimeType.startsWith("image/") || mimeType === "image/gif") {
    return { buffer, mimeType, ext: mimeType === "image/gif" ? "gif" : "bin" }
  }
  try {
    const optimized = await sharp(buffer)
      .resize(IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: IMAGE_QUALITY })
      .toBuffer()
    return { buffer: optimized, mimeType: "image/webp", ext: "webp" }
  } catch {
    return { buffer, mimeType, ext: mimeType.split("/")[1]?.replace("jpeg", "jpg") || "jpg" }
  }
}

async function supabaseFetch(url: string, options: RequestInit = {}) {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return fetch(`${supabaseUrl}${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> ?? {}),
    },
  })
}

async function ensureBucket() {
  const res = await supabaseFetch("/storage/v1/bucket/projects")
  if (res.status === 404) {
    await supabaseFetch("/storage/v1/bucket", {
      method: "POST",
      body: JSON.stringify({ id: "projects", name: "projects", public: true }),
    })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 422 })
    }

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Storage not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 })
    }

    // Try Supabase Storage first
    try {
      await ensureBucket()
      const safeName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9\s\-_.]/g, "").replace(/\s+/g, "-").slice(0, 80) || `upload-${Date.now()}`

      let buffer = Buffer.from(await file.arrayBuffer())
      let mimeType = file.type || "application/octet-stream"
      let ext = file.name.split(".").pop() ?? "bin"

      if (mimeType.startsWith("image/")) {
        const optimized = await optimizeImage(buffer, mimeType)
        buffer = optimized.buffer
        mimeType = optimized.mimeType
        ext = optimized.ext
      }

      const filename = `projects/${Date.now()}-${safeName}.${ext}`

      const res = await fetch(`${supabaseUrl}/storage/v1/object/projects/${filename}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": mimeType,
        },
        body: buffer,
      })

      if (res.ok) {
        const url = `${supabaseUrl}/storage/v1/object/public/projects/${filename}`
        return NextResponse.json({ url })
      }

      console.error("Supabase storage error:", await res.text())
    } catch (e) {
      console.error("Supabase upload failed, falling back to data URL:", e)
    }

    // Fallback: return base64 data URL
    const buffer = Buffer.from(await file.arrayBuffer())
    const url = `data:${file.type || "image/jpeg"};base64,${buffer.toString("base64")}`
    return NextResponse.json({ url })
  } catch (error) {
    console.error("Upload failed:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
