import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createNotification } from "@/lib/notifications"
import { sendEmail } from "@/lib/email"
import { stageOrder, getStageMessage } from "@/lib/stage-messages"

const stageSchema = z.object({
  stage: z.enum(stageOrder),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as Record<string, string>).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = stageSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid stage", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const newStage = parsed.data.stage

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const existing = await prisma.strategistProfile.findUnique({
      where: { userId: id },
      select: { id: true, stage: true },
    })

    if (!existing) {
      await prisma.strategistProfile.create({
        data: { userId: id, stage: newStage, bio: "" },
      })
    } else {
      await prisma.strategistProfile.update({
        where: { userId: id },
        data: { stage: newStage },
      })
    }

    const msg = getStageMessage(newStage)

    await createNotification({
      userId: id,
      title: msg.title,
      message: msg.body,
      link: "/dashboard",
    })

    await sendEmail({
      to: user.email,
      subject: msg.title,
      text: `Dear ${user.name ?? "Strategist"},\n\n${msg.body}\n\nView your dashboard: ${process.env.NEXT_PUBLIC_APP_URL ?? "https://tbpglobalstrategist.vercel.app"}/dashboard`,
      html: `<p>Dear ${user.name ?? "Strategist"},</p><p>${msg.body.replace(/\n/g, "<br>")}</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://tbpglobalstrategist.vercel.app"}/dashboard">View your dashboard</a></p>`,
    })

    return NextResponse.json({ message: `Stage updated to ${newStage}` })
  } catch (error) {
    console.error("Change stage error:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
