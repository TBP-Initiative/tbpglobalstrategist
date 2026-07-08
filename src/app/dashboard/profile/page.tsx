import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ProfileClient } from "./profile-client"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
        strategistProfile: {
          select: {
            title: true,
            bio: true,
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
          createdProjects: true,
          sentMessages: true,
          receivedMessages: true,
          notifications: true,
          achievements: true,
          publications: true,
        },
      },
    },
  })

  if (!user) redirect("/login")

  const latestProjects = await prisma.project.findMany({
    where: { createdById: user.id },
    take: 3,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, status: true, createdAt: true },
  })

  return (
    <ProfileClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        createdAt: user.createdAt.toISOString(),
        profile: user.strategistProfile
          ? {
              title: user.strategistProfile.title,
              bio: user.strategistProfile.bio,
              category: user.strategistProfile.category,
              city: user.strategistProfile.city,
              country: user.strategistProfile.country,
              countryCode: user.strategistProfile.countryCode,
              yearsOfExperience: user.strategistProfile.yearsOfExperience,
              availability: user.strategistProfile.availability,
              linkedinUrl: user.strategistProfile.linkedinUrl,
              websiteUrl: user.strategistProfile.websiteUrl,
            }
          : null,
        stats: {
          projects: user._count.createdProjects,
          sentMessages: user._count.sentMessages,
          receivedMessages: user._count.receivedMessages,
          notifications: user._count.notifications,
          achievements: user._count.achievements,
          publications: user._count.publications,
        },
        latestProjects: latestProjects.map((p) => ({
          id: p.id,
          title: p.title,
          status: p.status,
          createdAt: p.createdAt.toISOString(),
        })),
      }}
    />
  )
}
