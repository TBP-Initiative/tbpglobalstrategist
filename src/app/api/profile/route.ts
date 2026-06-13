import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, image, profile } = body

    const userData: Record<string, unknown> = {}
    if (name !== undefined) userData.name = name
    if (image !== undefined) userData.image = image

    if (Object.keys(userData).length > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: userData,
      })
    }

    if (profile && typeof profile === "object") {
      const profileData: Record<string, unknown> = {}
      if (profile.title !== undefined) profileData.title = profile.title
      if (profile.bio !== undefined) profileData.bio = profile.bio
      if (profile.yearsOfExperience !== undefined) profileData.yearsOfExperience = profile.yearsOfExperience
      if (profile.hourlyRate !== undefined) profileData.hourlyRate = profile.hourlyRate?.toString()
      if (profile.availability !== undefined) profileData.availability = profile.availability
      if (profile.linkedinUrl !== undefined) profileData.linkedinUrl = profile.linkedinUrl
      if (profile.websiteUrl !== undefined) profileData.websiteUrl = profile.websiteUrl

      if (Object.keys(profileData).length > 0) {
        await prisma.strategistProfile.upsert({
          where: { userId: session.user.id },
          create: { userId: session.user.id, ...profileData },
          update: profileData,
        } as any)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Profile update error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}
