import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getStrategistById, getStrategists } from "@/data/strategists"
import { ProfileContent } from "./profile-content"

export async function generateStaticParams() {
  const strategists = getStrategists()
  return strategists.map((s) => ({ id: s.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const strategist = getStrategistById(id)
  if (!strategist) return { title: "Strategist Not Found" }

  return {
    title: `${strategist.name} | TBP Global Strategists`,
    description: strategist.shortBio,
    openGraph: {
      title: `${strategist.name} | TBP Global Strategists`,
      description: strategist.shortBio,
    },
  }
}

export default async function StrategistProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const strategist = getStrategistById(id)

  if (!strategist) {
    notFound()
  }

  return <ProfileContent strategist={strategist} />
}
