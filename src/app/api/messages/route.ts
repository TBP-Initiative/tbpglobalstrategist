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

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, name: true, email: true, image: true } },
        receiver: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const conversationMap = new Map<
      string,
      {
        partnerId: string
        partnerName: string
        partnerEmail: string
        partnerImage: string | null
        lastMessage: string
        lastMessageAt: string
        unreadCount: number
        messages: {
          id: string
          content: string
          senderId: string
          createdAt: string
          read: boolean
        }[]
      }
    >()

    for (const msg of messages) {
      const partner = msg.senderId === userId ? msg.receiver : msg.sender
      const key = partner.id

      if (!conversationMap.has(key)) {
        conversationMap.set(key, {
          partnerId: partner.id,
          partnerName: partner.name ?? "Unknown",
          partnerEmail: partner.email,
          partnerImage: partner.image,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt.toISOString(),
          unreadCount: 0,
          messages: [],
        })
      }

      const conv = conversationMap.get(key)!
      conv.messages.push({
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        createdAt: msg.createdAt.toISOString(),
        read: msg.read,
      })

      if (!msg.read && msg.receiverId === userId) {
        conv.unreadCount++
      }
    }

    const conversations = Array.from(conversationMap.values()).sort(
      (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    )

    return NextResponse.json(conversations)
  } catch (err) {
    console.error("Messages fetch error:", err)
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
    const { receiverId, content } = body

    if (!receiverId || !content?.trim()) {
      return NextResponse.json({ error: "receiverId and content are required" }, { status: 422 })
    }

    if (receiverId === session.user.id) {
      return NextResponse.json({ error: "Cannot message yourself" }, { status: 422 })
    }

    const receiver = await prisma.user.findUnique({ where: { id: receiverId } })
    if (!receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 })
    }

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content: content.trim(),
      },
      include: {
        sender: { select: { id: true, name: true, email: true, image: true } },
        receiver: { select: { id: true, name: true, email: true, image: true } },
      },
    })

    return NextResponse.json({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      receiverId: message.receiverId,
      createdAt: message.createdAt.toISOString(),
      read: message.read,
      sender: message.sender,
      receiver: message.receiver,
    })
  } catch (err) {
    console.error("Message send error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { senderId } = body

    if (!senderId) {
      return NextResponse.json({ error: "senderId is required" }, { status: 422 })
    }

    await prisma.message.updateMany({
      where: {
        senderId,
        receiverId: session.user.id,
        read: false,
      },
      data: { read: true },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Message mark read error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
