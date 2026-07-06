import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

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

    const ext = file.name.split(".").pop() ?? "jpg"
    const filename = `projects/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const res = await fetch(`${supabaseUrl}/storage/v1/object/projects/${filename}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": file.type || "application/octet-stream",
      },
      body: buffer,
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("Supabase storage error:", err)
      return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }

    const url = `${supabaseUrl}/storage/v1/object/public/projects/${filename}`

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Upload failed:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
