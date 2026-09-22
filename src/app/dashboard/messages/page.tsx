import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { MessagesClient } from "./messages-client"

export const dynamic = "force-dynamic"

export default async function MessagesPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const userId = session.user.id

  const participations = await prisma.conversationParticipant.findMany({
    where: { userId },
    select: { conversationId: true },
  })

  const conversationIds = participations.map((p) => p.conversationId)

  const conversations = await prisma.conversation.findMany({
    where: { id: { in: conversationIds } },
    include: {
      participants: {
        select: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { id: true, content: true, senderId: true, read: true, createdAt: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  const unreadCounts = await prisma.message.groupBy({
    by: ["conversationId"],
    where: {
      conversationId: { in: conversationIds },
      read: false,
      senderId: { not: userId },
    },
    _count: { id: true },
  })

  const unreadMap = new Map(unreadCounts.map((u) => [u.conversationId, u._count.id]))

  const serialized = conversations.map((conv) => {
    const lastMsg = conv.messages[0] ?? null
    const others = conv.participants.filter((p) => p.user.id !== userId).map((p) => p.user)
    const name = conv.isGroup ? (conv.name ?? "Group Conversation") : (others[0]?.name ?? "Unknown")
    const image = conv.isGroup ? null : others[0]?.image ?? null

    return {
      id: conv.id,
      name,
      image,
      isGroup: conv.isGroup,
      participants: conv.participants.map((p) => p.user),
      lastMessage: lastMsg?.content ?? null,
      lastMessageAt: (lastMsg?.createdAt ?? conv.updatedAt).toISOString(),
      unreadCount: unreadMap.get(conv.id) ?? 0,
      lastSenderIsMe: lastMsg ? lastMsg.senderId === userId : false,
    }
  })

  return (
    <MessagesClient conversations={serialized} />
  )
}