import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { MessagesClient } from "./messages-client"

export default async function MessagesPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.user.id },
        { receiverId: session.user.id },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, name: true, email: true } },
      receiver: { select: { id: true, name: true, email: true } },
    },
  })

  const serialized = messages.map((m) => ({
    id: m.id,
    content: m.content,
    read: m.read,
    createdAt: m.createdAt.toISOString(),
    sender: { id: m.sender.id, name: m.sender.name, email: m.sender.email },
    receiver: { id: m.receiver.id, name: m.receiver.name, email: m.receiver.email },
    isSentByMe: m.senderId === session.user.id,
  }))

  return <MessagesClient messages={serialized} currentUserId={session.user.id} currentUserName={session.user.name ?? session.user.email ?? "User"} />
}
