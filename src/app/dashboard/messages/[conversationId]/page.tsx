import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { ThreadClient } from "./thread-client"

export const dynamic = "force-dynamic"

export default async function ConversationThreadPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { conversationId } = await params

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: {
        select: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          content: true,
          senderId: true,
          read: true,
          createdAt: true,
          sender: { select: { name: true } },
        },
      },
    },
  })

  if (!conversation) notFound()

  const isParticipant = conversation.participants.some((p) => p.user.id === session.user!.id)
  if (!isParticipant) redirect("/dashboard/messages")

  const userId = session.user.id
  const others = conversation.participants.filter((p) => p.user.id !== userId).map((p) => p.user)

  return (
    <ThreadClient
      conversationId={conversation.id}
      currentUserId={userId}
      threadName={
        conversation.isGroup
          ? (conversation.name ?? "Group Conversation")
          : (others[0]?.name ?? "Unknown")
      }
      threadImage={conversation.isGroup ? null : (others[0]?.image ?? null)}
      currentUserInitial={session.user.name?.[0]?.toUpperCase() ?? "Y"}
      messages={conversation.messages.map((m) => ({
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        senderName: m.sender.name ?? "Unknown",
        createdAt: m.createdAt.toISOString(),
        isSentByMe: m.senderId === userId,
        read: m.read,
      }))}
    />
  )
}