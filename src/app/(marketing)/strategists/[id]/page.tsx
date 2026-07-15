import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getStrategistById as getLocalStrategistById } from "@/data/strategists"
import type { StrategistProfile } from "@/data/strategists"
import { ProfileContent } from "./profile-content"
import { parseFirstCategory } from "@/lib/project-utils"

const stageLabels: Record<string, string> = {
  CANDIDATE: "Global Strategist Candidate",
  STRATEGIST: "Global Strategist",
  CONTRIBUTOR: "Strategic Contributor",
  PROJECT_ALIGNED: "Project-Aligned Strategist",
  SECTOR_LEAD: "Sector Lead or Workstream Lead",
  PAID_ADVISER: "Paid Project Adviser, Specialist or Implementation Contributor",
}

async function getStrategistById(id: string): Promise<StrategistProfile | null> {
  const local = getLocalStrategistById(id)
  if (local) return local

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        role: true,
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
            featuredProjectId: true,
            yearsOfExperience: true,
            linkedinUrl: true,
            websiteUrl: true,
            expertiseTags: {
              select: { tag: { select: { name: true } } },
            },
          },
        },
        _count: {
          select: {
            projectContributors: true,
            publications: true,
          },
        },
      },
    })

    if (!user || user.role !== "STRATEGIST") return null

    let featuredProject: {
      id: string; title: string; category: string | null; role: string; image: string | null;
      description: string; contribution: string; status: string; progress: number; slug: string;
    } | null = null

    const featuredId = user.strategistProfile?.featuredProjectId
    if (featuredId) {
      try {
        const contrib = await prisma.projectContributor.findUnique({
          where: { projectId_userId: { projectId: featuredId, userId: user.id } },
          include: {
            project: {
              select: {
                id: true, title: true, slug: true, description: true, shortDescription: true,
                image: true, category: true, status: true,
                milestones: { select: { weight: true, completed: true } },
              },
            },
          },
        })
        if (contrib?.project) {
          const proj = contrib.project
          const totalWeight = proj.milestones.reduce((sum, m) => sum + m.weight, 0)
          const completedWeight = proj.milestones.filter((m) => m.completed).reduce((sum, m) => sum + m.weight, 0)
          const progress = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0
          const stageLabelsMap: Record<string, string> = {
            CANDIDATE: "Global Strategist Candidate", STRATEGIST: "Global Strategist",
            CONTRIBUTOR: "Strategic Contributor", PROJECT_ALIGNED: "Project-Aligned Strategist",
            SECTOR_LEAD: "Sector Lead or Workstream Lead", PAID_ADVISER: "Paid Project Adviser",
          }

          let contribution = ""
          try {
            const latestSubmission = await prisma.submission.findFirst({
              where: { authorId: user.id, stage: { not: null } },
              orderBy: { createdAt: "desc" },
              select: { title: true },
            })
            if (latestSubmission) contribution = latestSubmission.title
          } catch { /* ignore */ }

          featuredProject = {
            id: proj.id, title: proj.title, slug: proj.slug,
            category: parseFirstCategory(proj.category) || "Strategic",
            role: contrib.role === "CONTRIBUTOR" ? (stageLabelsMap[user.strategistProfile?.stage ?? "CANDIDATE"] ?? "Contributor") : contrib.role,
            image: proj.image ?? "", description: proj.shortDescription ?? proj.description ?? "",
            contribution, status: proj.status, progress,
          }
        }
      } catch { /* ignore */ }
    }

    return {
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
      expertiseAreas: user.strategistProfile?.expertiseTags?.map((e) => e.tag.name) ?? [],
      industries: [],
      strategicFocusAreas: [],
      collaborationStatus: "open" as const,
      affiliation: null,
      featuredProject,
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
    }
  } catch (err) {
    console.error("Profile page error for id:", id, err)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const strategist = await getStrategistById(id)
  if (!strategist) return { title: "Strategist Not Found" }

  return {
    title: `${strategist.name} | TBP Global Strategists`,
    description: strategist.shortBio,
  }
}

export default async function StrategistProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const strategist = await getStrategistById(id)

  if (!strategist) {
    notFound()
  }

  let workAreas: string[] = []
  let projects: {
    id: string; title: string; slug: string; image: string | null;
    category: string | null; status: string; role: string;
  }[] = []
  let activities: {
    id: string; title: string; description: string; date: string;
    type: "publication" | "milestone" | "contribution" | "assignment";
    fileUrl?: string; fileType?: string; fileSize?: number | null;
  }[] = []

  if (!getLocalStrategistById(id)) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          workAreaAssignments: {
            select: { workArea: { select: { name: true } } },
          },
        },
      })
      workAreas = user?.workAreaAssignments.map((a) => a.workArea.name) ?? []
    } catch { /* ignore */ }

    try {
      const contributions = await prisma.projectContributor.findMany({
        where: { userId: id },
        select: {
          role: true,
          project: {
            select: {
              id: true, title: true, slug: true, image: true,
              category: true, status: true,
            },
          },
        },
        orderBy: { joinedAt: "desc" },
      })

      projects = contributions.map((c) => ({
        id: c.project.id,
        title: c.project.title,
        slug: c.project.slug,
        image: c.project.image,
        category: parseFirstCategory(c.project.category),
        status: c.project.status,
        role: c.role,
      }))
    } catch { /* ignore */ }

    try {
      const submissions = await prisma.submission.findMany({
        where: { userId: id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          fileUrl: true,
          fileType: true,
          fileSize: true,
          stage: true,
          createdAt: true,
        },
      })

      activities = submissions.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description ?? `Submitted for stage: ${s.stage}`,
        date: s.createdAt.toISOString(),
        type: "milestone" as const,
        fileUrl: s.fileUrl,
        fileType: s.fileType,
        fileSize: s.fileSize,
      }))
    } catch { /* ignore */ }
  }

  return <ProfileContent strategist={strategist} workAreas={workAreas} projects={projects} activities={activities} />
}
