"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

type ThreadMessage = {
  id: string
  content: string
  senderId: string
  senderName: string
  createdAt: string
  isSentByMe: boolean
  read: boolean
}

export function ThreadClient({
  conversationId,
  currentUserId,
  threadName,
  threadImage,
  currentUserInitial,
  messages,
}: {
  conversationId: string
  currentUserId: string
  threadName: string
  threadImage: string | null
  currentUserInitial: string
  messages: ThreadMessage[]
}) {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetch(`/api/messages/${conversationId}`, { method: "PATCH", headers: { "Content-Type": "application/json" } }).catch(() => {})
  }, [conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages.length])

  async function send() {
    const body = content.trim()
    if (!body || sending) return
    setSending(true)
    try {
      const res = await fetch(`/api/messages/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: body }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to send")
      }
      setContent("")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send")
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const initials = threadName
    ? threadName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?"

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/messages"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground transition-colors hover:bg-muted"
              aria-label="Back to conversations"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="flex items-center gap-3">
              <Avatar size="md">
                {threadImage ? (
                  <img src={threadImage} alt={threadName} className="h-full w-full object-cover" />
                ) : null}
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{threadName}</h1>
                <p className="text-xs text-muted-foreground">Conversation</p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.15}>
        <GlassCard className="flex flex-col overflow-hidden" intensity="light">
          <div className="max-h-[60vh] min-h-[320px] space-y-3 overflow-y-auto p-5">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <MessageIcon />
                <p className="text-sm text-muted-foreground">No messages yet.</p>
                <p className="text-xs text-muted-foreground/70">Say hello to start the conversation.</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMine = m.isSentByMe && m.senderId === currentUserId
                return (
                  <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        isMine
                          ? "rounded-br-sm bg-indigo-600 text-white"
                          : "rounded-bl-sm border border-border bg-white text-gray-900"
                      }`}
                    >
                      {!isMine && (
                        <p className="mb-0.5 text-[11px] font-semibold text-indigo-600">{m.senderName}</p>
                      )}
                      <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
                      <p
                        className={`mt-1 text-[10px] ${isMine ? "text-indigo-200" : "text-muted-foreground"}`}
                      >
                        {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-border p-4">
            <div className="flex items-end gap-2">
              <Avatar size="sm" className="mb-0.5 shrink-0">
                <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                  {currentUserInitial}
                </AvatarFallback>
              </Avatar>
              <textarea
                ref={inputRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                placeholder="Write a message..."
                rows={1}
                className="max-h-32 min-h-[40px] flex-1 resize-none rounded-xl border border-border bg-muted px-3 py-2 text-sm text-fg placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button type="button" onClick={send} disabled={sending || !content.trim()} className="shrink-0">
                {sending ? (
                  <Send size={14} className="animate-pulse" />
                ) : (
                  <Send size={14} />
                )}
              </Button>
            </div>
          </div>
        </GlassCard>
      </AnimatedSection>
    </div>
  )
}

function MessageIcon() {
  return (
    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
      <User size={24} className="text-indigo-400" />
    </div>
  )
}