import { NextResponse } from "next/server"
import { getApplication, postApplication } from "@/lib/application-service"

export const dynamic = "force-dynamic"

export async function GET() {
  return getApplication("INSTITUTE_APPLICATION")
}

export async function POST(req: Request) {
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { step, ...data } = body
  return postApplication("INSTITUTE_APPLICATION", step, data)
}
