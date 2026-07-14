"use client"

import { useState, useEffect, useCallback, Suspense, lazy } from "react"
import { useSession } from "next-auth/react"
import { MessageSquare } from "lucide-react"

const ChatWidget = lazy(() =>
  import("@/components/chat/chat-widget").then((m) => ({ default: m.ChatWidget }))
)

export function MarketingChat() {
  const { data: session } = useSession()
  const [chatOpenWith, setChatOpenWith] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [totalUnread, setTotalUnread] = useState(0)

  const fetchUnread = useCallback(async () => {
    try {
      const res = await fetch("/api/messages")
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setTotalUnread(data.reduce((s: number, c: { unreadCount: number }) => s + (c.unreadCount || 0), 0))
        }
      }
    } catch {}
  }, [])

  useEffect(() => {
    fetchUnread()
    const interval = setInterval(fetchUnread, 15000)
    return () => clearInterval(interval)
  }, [fetchUnread])

  useEffect(() => {
    function handleOpenChat(e: Event) {
      const customEvent = e as CustomEvent
      if (customEvent.detail?.userId) {
        setChatOpenWith(null)
        setChatOpen(true)
        requestAnimationFrame(() => {
          setChatOpenWith(customEvent.detail.userId)
        })
      }
    }
    window.addEventListener("open-chat", handleOpenChat)
    return () => window.removeEventListener("open-chat", handleOpenChat)
  }, [])

  return (
    <>
      {chatOpen && (
        <Suspense fallback={null}>
          <ChatWidget
            currentUserId={session?.user?.id ?? ""}
            openWithUser={chatOpenWith}
          />
        </Suspense>
      )}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#013466] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <MessageSquare size={22} />
          {totalUnread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {totalUnread > 9 ? "9+" : totalUnread}
            </span>
          )}
        </button>
      )}
    </>
  )
}
