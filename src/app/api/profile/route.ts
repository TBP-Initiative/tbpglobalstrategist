import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createNotification, notifyAdmins } from "@/lib/notifications"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        strategistProfile: {
          select: {
            title: true,
            bio: true,
            stage: true,
            sector: true,
            category: true,
            city: true,
            country: true,
            countryCode: true,
            yearsOfExperience: true,
            availability: true,
            linkedinUrl: true,
            websiteUrl: true,
            expertiseTags: {
              select: { tag: { select: { id: true, name: true } } },
            },
          },
        },
        workAreaAssignments: {
          select: { workArea: { select: { id: true, name: true, slug: true } } },
        },
      },
    })

    return NextResponse.json(user)
  } catch (err) {
    console.error("Profile fetch error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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
      if (profile.title !== undefined) {
        if (typeof profile.title !== "string" || profile.title.length > 100) {
          return NextResponse.json({ error: "Title must be 100 characters or fewer" }, { status: 400 })
        }
        profileData.title = profile.title
      }
      if (profile.bio !== undefined) {
        if (typeof profile.bio !== "string" || profile.bio.length > 2000) {
          return NextResponse.json({ error: "Bio must be 2000 characters or fewer" }, { status: 400 })
        }
        profileData.bio = profile.bio
      }
      if (profile.yearsOfExperience !== undefined) profileData.yearsOfExperience = profile.yearsOfExperience
      if (profile.availability !== undefined) profileData.availability = profile.availability
      if (profile.category !== undefined) profileData.category = profile.category
      if (profile.city !== undefined) profileData.city = profile.city
      if (profile.country !== undefined) profileData.country = profile.country
      if (profile.countryCode !== undefined) profileData.countryCode = profile.countryCode
      if (profile.linkedinUrl !== undefined) profileData.linkedinUrl = profile.linkedinUrl
      if (profile.websiteUrl !== undefined) profileData.websiteUrl = profile.websiteUrl

      if (Object.keys(profileData).length > 0) {
        await prisma.strategistProfile.upsert({
          where: { userId: session.user.id },
          create: { userId: session.user.id, ...profileData },
          update: profileData,
        } as any)

        notifyAdmins({
          title: "Profile updated",
          message: `${session.user.name ?? "A user"} updated their profile.`,
          link: "/dashboard/admin",
        })
      }

      if (Array.isArray(profile.expertiseTags)) {
        const tags = profile.expertiseTags.filter((t: unknown): t is string => typeof t === "string" && t.trim().length > 0).slice(0, 5)
        const profileRecord = await prisma.strategistProfile.findUnique({
          where: { userId: session.user.id },
          select: { id: true },
        })
        if (profileRecord) {
          await prisma.expertiseTag.deleteMany({ where: { profileId: profileRecord.id } })
          for (const tagName of tags) {
            const slug = tagName.trim().toLowerCase().replace(/\s+/g, "-")
            const tag = await prisma.tag.upsert({
              where: { slug },
              create: { name: tagName.trim(), slug },
              update: {},
            })
            await prisma.expertiseTag.create({
              data: { profileId: profileRecord.id, tagId: tag.id },
            })
          }
        }
      }
    }

    await createNotification({
      userId: session.user.id,
      title: "Profile updated",
      message: "Your profile has been updated successfully.",
      link: "/dashboard/profile",
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Profile update error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}
