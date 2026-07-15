import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

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
      const ext = file.name.split(".").pop() ?? "jpg"
      const rawName = (formData.get("filename") as string)?.trim() || file.name.replace(/\.[^.]+$/, "")
      const safeName = rawName.replace(/[^a-zA-Z0-9\s\-_.]/g, "").replace(/\s+/g, "-").slice(0, 80) || `upload-${Date.now()}`
      const filename = `projects/${Date.now()}-${safeName}.${ext}`
      const buffer = Buffer.from(await file.arrayBuffer())

      const res = await fetch(`${supabaseUrl}/storage/v1/object/projects/${filename}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": file.type || "application/octet-stream",
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
