"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { ChatWidget } from "@/components/chat/chat-widget"

export function MarketingChat() {
  const { data: session } = useSession()
  const [chatOpenWith, setChatOpenWith] = useState<string | null>(null)

  useEffect(() => {
    function handleOpenChat(e: Event) {
      const customEvent = e as CustomEvent
      if (customEvent.detail?.userId) {
        setChatOpenWith(customEvent.detail.userId)
      }
    }
    window.addEventListener("open-chat", handleOpenChat)
    return () => window.removeEventListener("open-chat", handleOpenChat)
  }, [])

  return <ChatWidget currentUserId={session?.user?.id ?? ""} openWithUser={chatOpenWith} />
}
