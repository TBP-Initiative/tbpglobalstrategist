"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"

const ChatWidget = dynamic(
  () => import("@/components/chat/chat-widget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false }
)

export function LazyMarketingChat() {
  const { data: session } = useSession()
  const [chatOpenWith, setChatOpenWith] = useState<string | null>(null)

  useEffect(() => {
    function handleOpenChat(e: Event) {
      const customEvent = e as CustomEvent
      if (customEvent.detail?.userId) {
        setChatOpenWith(null)
        requestAnimationFrame(() => {
          setChatOpenWith(customEvent.detail.userId)
        })
      }
    }
    window.addEventListener("open-chat", handleOpenChat)
    return () => window.removeEventListener("open-chat", handleOpenChat)
  }, [])

  return <ChatWidget currentUserId={session?.user?.id ?? ""} openWithUser={chatOpenWith} />
}
