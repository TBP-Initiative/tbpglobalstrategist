"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { ChatWidget } from "@/components/chat/chat-widget"

export function ChatIntegration() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [chatOpenWith, setChatOpenWith] = useState<string | null>(null)

  useEffect(() => {
    const userParam = searchParams.get("user")
    if (userParam) setChatOpenWith(userParam)
  }, [searchParams])

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
