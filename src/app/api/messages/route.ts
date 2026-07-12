import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
          select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
            read: true,
          },
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

    const result = conversations.map((conv) => {
      const lastMsg = conv.messages[0] ?? null
      const otherParticipants = conv.participants
        .filter((p) => p.user.id !== userId)
        .map((p) => p.user)

      return {
        id: conv.id,
        name: conv.isGroup ? conv.name : (otherParticipants[0]?.name ?? "Unknown"),
        isGroup: conv.isGroup,
        participants: conv.participants.map((p) => p.user),
        lastMessage: lastMsg?.content ?? null,
        lastMessageAt: (lastMsg?.createdAt ?? conv.updatedAt).toISOString(),
        unreadCount: unreadMap.get(conv.id) ?? 0,
      }
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error("Conversations fetch error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { participantIds, name } = body

    if (!Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json({ error: "participantIds is required" }, { status: 422 })
    }

    const allParticipantIds = [...new Set([session.user.id, ...participantIds])]
    const isGroup = allParticipantIds.length > 2

    if (!isGroup) {
      const otherUserId = allParticipantIds.find((id) => id !== session.user.id)
      if (otherUserId) {
        const existingParts = await prisma.conversationParticipant.findMany({
          where: { userId: { in: [session.user.id, otherUserId] } },
          select: { conversationId: true },
        })
        const existingConvIds = existingParts.map((p) => p.conversationId)

        if (existingConvIds.length > 0) {
          const existingConv = await prisma.conversation.findFirst({
            where: {
              id: { in: existingConvIds },
              isGroup: false,
              participants: { every: { userId: { in: [session.user.id, otherUserId] } } },
            },
            include: {
              participants: {
                select: { user: { select: { id: true, name: true, email: true, image: true } } },
              },
            },
          })

          if (existingConv) {
            return NextResponse.json({
              id: existingConv.id,
              name: existingConv.participants.find((p) => p.user.id !== session.user.id)?.user.name ?? "Unknown",
              isGroup: false,
              participants: existingConv.participants.map((p) => p.user),
            })
          }
        }
      }
    }

    const conversation = await prisma.conversation.create({
      data: {
        name: isGroup ? (name || null) : null,
        isGroup,
        participants: {
          create: allParticipantIds.map((id) => ({ userId: id })),
        },
      },
      include: {
        participants: {
          select: { user: { select: { id: true, name: true, email: true, image: true } } },
        },
      },
    })

    return NextResponse.json({
      id: conversation.id,
      name: conversation.isGroup
        ? conversation.name
        : conversation.participants.find((p) => p.user.id !== session.user.id)?.user.name ?? "Unknown",
      isGroup: conversation.isGroup,
      participants: conversation.participants.map((p) => p.user),
    })
  } catch (err) {
    console.error("Conversation create error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
