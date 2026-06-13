import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { readdir, stat } from "fs/promises"
import { join } from "path"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const dir = join(process.cwd(), "public", "uploads")
  const files: { url: string; name: string; size: number; uploadedAt: string }[] = []

  try {
    const entries = await readdir(dir)
    for (const name of entries) {
      const full = join(dir, name)
      const s = await stat(full)
      if (s.isFile()) {
        files.push({
          url: `/uploads/${name}`,
          name,
          size: s.size,
          uploadedAt: s.mtime.toISOString(),
        })
      }
    }
  } catch {}

  files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

  return NextResponse.json(files)
}
