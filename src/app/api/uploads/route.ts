import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json([])
  }

  const res = await fetch(`${supabaseUrl}/storage/v1/object/list/projects`, {
    headers: { Authorization: `Bearer ${supabaseKey}` },
  })

  if (!res.ok) return NextResponse.json([])

  const objects: { name: string; created_at: string; metadata: { size: number } }[] = await res.json()

  const files = objects
    .filter((o) => !o.name.endsWith("/"))
    .map((o) => ({
      url: `${supabaseUrl}/storage/v1/object/public/projects/${o.name}`,
      name: o.name.split("/").pop() ?? o.name,
      size: o.metadata?.size ?? 0,
      uploadedAt: o.created_at,
    }))
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

  return NextResponse.json(files)
}
