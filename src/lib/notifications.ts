import { prisma } from "@/lib/prisma"

type NotifType = "SYSTEM" | "MESSAGE" | "PROJECT_INVITE" | "ACHIEVEMENT_UNLOCKED" | "PUBLICATION_APPROVED"

export async function createNotification({
  userId,
  title,
  message,
  type = "SYSTEM",
  link,
}: {
  userId: string
  title: string
  message: string
  type?: NotifType
  link?: string
}) {
  return prisma.notification.create({
    data: { userId, title, message, type, link },
  })
}

export async function notifyAdmins({
  title,
  message,
  type = "SYSTEM",
  link,
}: {
  title: string
  message: string
  type?: NotifType
  link?: string
}) {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  })
  await prisma.notification.createMany({
    data: admins.map((a) => ({
      userId: a.id,
      title,
      message,
      type,
      link,
    })),
  })
}
