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
    const protocol = process.env.VERCEL ? "https" : "http"
    const host = process.env.VERCEL
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL || "tbpglobalstrategist-flame.vercel.app"
      : "localhost:3000"
    const res = await fetch(`${protocol}://${host}/api/strategists`, { cache: "no-store" })
    if (!res.ok) return null
    const all = await res.json()
    if (!Array.isArray(all)) return null
    return all.find((s: StrategistProfile) => s.id === id) ?? null
  } catch (err) {
    console.error("Profile page fetch error for id:", id, err)
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
  }

  return <ProfileContent strategist={strategist} workAreas={workAreas} projects={projects} />
}
