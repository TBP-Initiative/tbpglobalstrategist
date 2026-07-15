import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const stageLabels: Record<string, string> = {
  CANDIDATE: "Global Strategist Candidate",
  STRATEGIST: "Global Strategist",
  CONTRIBUTOR: "Strategic Contributor",
  PROJECT_ALIGNED: "Project-Aligned Strategist",
  SECTOR_LEAD: "Sector Lead or Workstream Lead",
  PAID_ADVISER: "Paid Project Adviser, Specialist or Implementation Contributor",
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")?.trim() ?? ""

    const where: Record<string, unknown> = { role: "STRATEGIST" }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { strategistProfile: { title: { contains: search, mode: "insensitive" } } },
      ]
    }

    const dbStrategists = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
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
          },
        },
        _count: {
          select: {
            projectContributors: true,
            publications: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: search ? 10 : undefined,
    })

    const strategists = dbStrategists.map((user) => ({
      id: user.id,
      name: user.name ?? "Unknown",
      headline: user.strategistProfile?.title ?? stageLabels[user.strategistProfile?.stage ?? "CANDIDATE"] ?? "Strategist",
      badge: stageLabels[user.strategistProfile?.stage ?? "CANDIDATE"] ?? "Global Strategist Candidate",
      stage: user.strategistProfile?.stage ?? "CANDIDATE",
      sector: user.strategistProfile?.sector ?? null,
      category: user.strategistProfile?.category ?? null,
      city: user.strategistProfile?.city ?? null,
      country: user.strategistProfile?.country ?? null,
      countryCode: user.strategistProfile?.countryCode ?? null,
      avatar: user.image ?? "",
      coverImage: "gradient-1",
      bio: user.strategistProfile?.bio ?? "",
      shortBio: user.strategistProfile?.bio
        ? user.strategistProfile.bio.length > 120
          ? user.strategistProfile.bio.slice(0, 120) + "..."
          : user.strategistProfile.bio
        : "A global strategist contributing to the TBP ecosystem.",
      expertiseAreas: [],
      industries: [],
      strategicFocusAreas: [],
      collaborationStatus: "open" as const,
      affiliation: null,
      stats: {
        projects: user._count.projectContributors,
        publications: user._count.publications,
        network: 0,
        yearsActive: user.strategistProfile?.yearsOfExperience ?? 0,
      },
      featuredProjects: [],
      activityTimeline: [],
      publications: [],
      achievements: [],
      mediaGallery: [],
      network: [],
      contact: {
        email: "",
        linkedin: user.strategistProfile?.linkedinUrl ?? "",
        website: user.strategistProfile?.websiteUrl ?? "",
      },
      location: [user.strategistProfile?.city, user.strategistProfile?.country].filter(Boolean).join(", "),
      createdAt: user.createdAt.toISOString(),
    }))

    return NextResponse.json(strategists)
  } catch (err) {
    console.error("Strategists fetch error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
