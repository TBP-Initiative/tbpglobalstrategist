"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, X, Minus, Search, CircleDot } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
  read: boolean
}

interface Conversation {
  partnerId: string
  partnerName: string
  partnerEmail: string
  partnerImage: string | null
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  messages: Message[]
}

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "now"
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  return `${days}d`
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function ChatWidget({ currentUserId, openWithUser }: { currentUserId: string; openWithUser?: string | null }) {
  const [minimized, setMinimized] = useState(true)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/messages")
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) setConversations(data)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 15000)
    return () => clearInterval(interval)
  }, [fetchConversations])

  useEffect(() => {
    if (openWithUser) {
      setMinimized(false)
      setActiveChat(openWithUser)
      fetchConversations()
    }
  }, [openWithUser, fetchConversations])

  useEffect(() => {
    if (!minimized && activeChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [minimized, activeChat, conversations])

  useEffect(() => {
    if (!minimized && activeChat) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [minimized, activeChat])

  const markAsRead = useCallback(async (partnerId: string) => {
    try {
      await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: partnerId }),
      })
      setConversations((prev) =>
        prev.map((c) =>
          c.partnerId === partnerId ? { ...c, unreadCount: 0, messages: c.messages.map((m) => ({ ...m, read: true })) } : c
        )
      )
    } catch { /* ignore */ }
  }, [])

  const openChat = useCallback((partnerId: string) => {
    setActiveChat(partnerId)
    setMinimized(false)
    markAsRead(partnerId)
  }, [markAsRead])

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !activeChat || sending) return
    setSending(true)
    const content = newMessage.trim()
    setNewMessage("")

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: activeChat, content }),
      })
      if (res.ok) {
        const msg = await res.json()
        setConversations((prev) => {
          const existing = prev.find((c) => c.partnerId === activeChat)
          if (existing) {
            return prev.map((c) =>
              c.partnerId === activeChat
                ? {
                    ...c,
                    lastMessage: content,
                    lastMessageAt: msg.createdAt,
                    messages: [...c.messages, msg],
                  }
                : c
            ).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
          }
          return [
            {
              partnerId: activeChat,
              partnerName: activeChat,
              partnerEmail: "",
              partnerImage: null,
              lastMessage: content,
              lastMessageAt: msg.createdAt,
              unreadCount: 0,
              messages: [msg],
            },
            ...prev,
          ]
        })
      }
    } catch { /* ignore */ }
    setSending(false)
  }, [newMessage, activeChat, sending])

  const filtered = conversations.filter((c) =>
    c.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeConversation = conversations.find((c) => c.partnerId === activeChat)

  if (!minimized && activeChat && activeConversation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-4 right-4 z-50 flex w-[360px] flex-col rounded-xl border border-border bg-background shadow-2xl sm:w-[380px]"
        style={{ height: "500px" }}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <button onClick={() => { setActiveChat(null); }} className="flex items-center gap-2 min-w-0">
            <Avatar size="sm">
              {activeConversation.partnerImage && (
                <img src={activeConversation.partnerImage} alt="" className="h-full w-full object-cover" />
              )}
              <AvatarFallback className="text-xs">{getInitials(activeConversation.partnerName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{activeConversation.partnerName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{activeConversation.partnerEmail}</p>
            </div>
          </button>
          <div className="flex items-center gap-1">
            <button onClick={() => { setActiveChat(null); }} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {activeConversation.messages.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-xs text-muted-foreground">No messages yet. Say hello!</p>
            </div>
          )}
          {[...activeConversation.messages].reverse().map((msg) => {
            const isMe = msg.senderId === currentUserId
            return (
              <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  )}
                >
                  <p className="break-words">{msg.content}</p>
                  <p className={cn("mt-1 text-[10px]", isMe ? "text-primary-foreground/60" : "text-muted-foreground")}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Write a message..."
              className="flex-1 rounded-full border border-border bg-muted px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      {!minimized && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-4 right-4 z-50 flex w-[340px] flex-col rounded-xl border border-border bg-background shadow-2xl sm:w-[360px]"
          style={{ height: "480px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Messaging</h3>
              {totalUnread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                  {totalUnread}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMinimized(true)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                <Minus size={14} />
              </button>
              <button onClick={() => { setMinimized(true); setActiveChat(null); }} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="px-3 py-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="h-8 w-full rounded-lg border border-border bg-muted pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <MessageSquare size={24} className="mb-2 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
              </div>
            )}
            {filtered.map((conv) => (
              <button
                key={conv.partnerId}
                onClick={() => openChat(conv.partnerId)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
              >
                <div className="relative shrink-0">
                  <Avatar size="sm">
                    {conv.partnerImage && (
                      <img src={conv.partnerImage} alt="" className="h-full w-full object-cover" />
                    )}
                    <AvatarFallback className="text-xs">{getInitials(conv.partnerName)}</AvatarFallback>
                  </Avatar>
                  {conv.unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("text-sm truncate", conv.unreadCount > 0 ? "font-semibold" : "font-medium")}>
                      {conv.partnerName}
                    </p>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{formatTime(conv.lastMessageAt)}</span>
                  </div>
                  <p className={cn("text-xs truncate", conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setMinimized(!minimized)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-shadow hover:shadow-xl hover:shadow-primary/40"
      >
        {minimized ? (
          <>
            <MessageSquare size={22} />
            {totalUnread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {totalUnread > 9 ? "9+" : totalUnread}
              </span>
            )}
          </>
        ) : (
          <X size={22} />
        )}
      </motion.button>
    </AnimatePresence>
  )
}
