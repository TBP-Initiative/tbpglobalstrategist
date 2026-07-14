"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MessageSquare, Send, X, Minus, Search, Users, Plus, Check } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  senderId: string
  sender?: { name: string }
  createdAt: string
  read: boolean
}

interface Participant {
  id: string
  name: string | null
  email: string
  image: string | null
}

interface Conversation {
  id: string
  name: string
  isGroup: boolean
  participants: Participant[]
  lastMessage: string | null
  lastMessageAt: string
  unreadCount: number
  messages: Message[]
}

interface Strategist {
  id: string
  name: string
  avatar: string
  headline: string
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

type View = "list" | "chat" | "new-group"

function ChatPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex w-[360px] flex-col rounded-xl border border-border bg-background shadow-2xl transition-all duration-200 ease-out sm:w-[380px]",
        className
      )}
      style={{ height: "500px", animation: "chatSlideIn 0.2s ease-out" }}
    >
      <style>{`
        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      {children}
    </div>
  )
}

export function ChatWidget({ currentUserId, openWithUser }: { currentUserId: string; openWithUser?: string | null }) {
  const [minimized, setMinimized] = useState(true)
  const [view, setView] = useState<View>("list")
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [strategists, setStrategists] = useState<Strategist[]>([])
  const [groupSearch, setGroupSearch] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [groupName, setGroupName] = useState("")
  const [creatingGroup, setCreatingGroup] = useState(false)
  const [myUserId, setMyUserId] = useState<string>(currentUserId)

  useEffect(() => {
    if (currentUserId && currentUserId !== myUserId) {
      setMyUserId(currentUserId)
    }
  }, [currentUserId])

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

  const openWithUserRef = useRef<string | null>(null)

  useEffect(() => {
    if (openWithUser && openWithUser !== myUserId) {
      openWithUserRef.current = openWithUser
      setMinimized(false)
      findOrCreateConversation(openWithUser)
    }
  }, [openWithUser, myUserId, findOrCreateConversation])

  useEffect(() => {
    if (!minimized && view === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [minimized, view, messages])

  useEffect(() => {
    if (!minimized && view === "chat") {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [minimized, view])

  const fetchMessages = useCallback(async (convId: string) => {
    setLoadingMessages(true)
    try {
      const res = await fetch(`/api/messages/${convId}`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) setMessages(data)
      }
    } catch { /* ignore */ }
    setLoadingMessages(false)
  }, [])

  const markAsRead = useCallback(async (convId: string) => {
    try {
      await fetch(`/api/messages/${convId}`, {
        method: "PATCH",
      })
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0, messages: c.messages.map((m) => ({ ...m, read: true })) } : c))
      )
    } catch { /* ignore */ }
  }, [])

  const findOrCreateConversation = useCallback(async (userId: string) => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantIds: [userId] }),
      })
      if (res.ok) {
        const conv = await res.json()
        await fetchConversations()
        setActiveConvId(conv.id)
        setView("chat")
        fetchMessages(conv.id)
        markAsRead(conv.id)
      }
    } catch { /* ignore */ }
  }, [fetchConversations, fetchMessages, markAsRead])

  const openChat = useCallback((convId: string) => {
    setActiveConvId(convId)
    setView("chat")
    fetchMessages(convId)
    markAsRead(convId)
  }, [fetchMessages, markAsRead])

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !activeConvId || sending) return
    setSending(true)
    const content = newMessage.trim()
    setNewMessage("")

    try {
      const res = await fetch(`/api/messages/${activeConvId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        const msg = await res.json()
        setMessages((prev) => [...prev, msg])
        setConversations((prev) =>
          prev
            .map((c) =>
              c.id === activeConvId
                ? { ...c, lastMessage: content, lastMessageAt: msg.createdAt, messages: [...c.messages, msg] }
                : c
            )
            .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
        )
      }
    } catch { /* ignore */ }
    setSending(false)
  }, [newMessage, activeConvId, sending])

  const fetchStrategists = useCallback(async () => {
    if (strategists.length > 0) return
    try {
      const res = await fetch("/api/strategists")
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setStrategists(data.map((s: Strategist) => ({ id: s.id, name: s.name, avatar: s.avatar, headline: s.headline })))
        }
      }
    } catch { /* ignore */ }
  }, [strategists.length])

  const createGroup = useCallback(async () => {
    if (selectedMembers.length < 2 || creatingGroup) return
    setCreatingGroup(true)
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantIds: selectedMembers,
          name: groupName.trim() || null,
        }),
      })
      if (res.ok) {
        const conv = await res.json()
        await fetchConversations()
        setActiveConvId(conv.id)
        setView("chat")
        setGroupName("")
        setSelectedMembers([])
        setGroupSearch("")
        fetchMessages(conv.id)
      }
    } catch { /* ignore */ }
    setCreatingGroup(false)
  }, [selectedMembers, groupName, creatingGroup, fetchConversations, fetchMessages])

  const activeConversation = conversations.find((c) => c.id === activeConvId)
  const currentUserIdForCheck = myUserId || currentUserId

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredStrategists = strategists.filter(
    (s) =>
      s.name.toLowerCase().includes(groupSearch.toLowerCase()) &&
      s.id !== currentUserIdForCheck
  )

  const openNewGroup = () => {
    setView("new-group")
    setSelectedMembers([])
    setGroupName("")
    setGroupSearch("")
    fetchStrategists()
  }

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const getConvDisplayName = (conv: Conversation) => {
    if (conv.isGroup) return conv.name || conv.participants.map((p) => p.name ?? "Unknown").join(", ")
    const other = conv.participants.find((p) => p.id !== currentUserIdForCheck)
    return other?.name ?? "Unknown"
  }

  const getConvDisplayImage = (conv: Conversation) => {
    if (conv.isGroup) return null
    const other = conv.participants.find((p) => p.id !== currentUserIdForCheck)
    return other?.image ?? null
  }

  // ── Chat thread view ──
  if (!minimized && view === "chat" && activeConversation) {
    const chatName = getConvDisplayName(activeConversation)
    const chatImage = getConvDisplayImage(activeConversation)

    return (
      <ChatPanel>
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <button onClick={() => { setView("list"); setActiveConvId(null); setMessages([]) }} className="flex items-center gap-2 min-w-0">
            {activeConversation.isGroup ? (
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                <Users size={14} className="text-white" />
              </div>
            ) : (
              <Avatar size="sm">
                {chatImage && (
                  <img src={chatImage} alt="" className="h-full w-full object-cover" />
                )}
                <AvatarFallback className="text-xs">{getInitials(chatName)}</AvatarFallback>
              </Avatar>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{chatName}</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {activeConversation.isGroup
                  ? `${activeConversation.participants.length} members`
                  : (activeConversation.participants.find((p) => p.id !== currentUserIdForCheck)?.email ?? "")}
              </p>
            </div>
          </button>
          <div className="flex items-center gap-1">
            <button onClick={() => { setView("list"); setActiveConvId(null); setMessages([]) }} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {loadingMessages ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-xs text-muted-foreground">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-xs text-muted-foreground">No messages yet. Say hello!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUserIdForCheck
              const showSender = activeConversation.isGroup && !isMe
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
                    {showSender && (
                      <p className="mb-0.5 text-[10px] font-semibold text-primary">
                        {msg.sender?.name ?? "Unknown"}
                      </p>
                    )}
                    <p className="break-words">{msg.content}</p>
                    <p className={cn("mt-1 text-[10px]", isMe ? "text-primary-foreground/60" : "text-muted-foreground")}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })
          )}
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
      </ChatPanel>
    )
  }

  // ── New group view ──
  if (!minimized && view === "new-group") {
    return (
      <ChatPanel>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setView("list")} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
              <X size={14} />
            </button>
            <h3 className="text-sm font-semibold">New Group</h3>
            {selectedMembers.length >= 2 && (
              <span className="text-[10px] text-muted-foreground">{selectedMembers.length} selected</span>
            )}
          </div>
          <button
            onClick={createGroup}
            disabled={selectedMembers.length < 2 || creatingGroup}
            className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            {creatingGroup ? "Creating..." : "Create"}
          </button>
        </div>

        {/* Group name */}
        <div className="border-b border-border px-4 py-2">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name (optional)"
            className="h-9 w-full rounded-lg border border-border bg-muted px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Selected members */}
        {selectedMembers.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-border px-4 py-2">
            {selectedMembers.map((id) => {
              const s = strategists.find((x) => x.id === id)
              if (!s) return null
              return (
                <button
                  key={id}
                  onClick={() => toggleMember(id)}
                  className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/20"
                >
                  {s.name.split(" ")[0]}
                  <X size={10} />
                </button>
              )
            })}
          </div>
        )}

        {/* Search */}
        <div className="px-3 py-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={groupSearch}
              onChange={(e) => setGroupSearch(e.target.value)}
              placeholder="Search people..."
              className="h-8 w-full rounded-lg border border-border bg-muted pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Member list */}
        <div className="flex-1 overflow-y-auto">
          {filteredStrategists.map((s) => {
            const selected = selectedMembers.includes(s.id)
            return (
              <button
                key={s.id}
                onClick={() => toggleMember(s.id)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/50"
              >
                <Avatar size="sm">
                  {s.avatar && (
                    <img src={s.avatar} alt="" className="h-full w-full object-cover" />
                  )}
                  <AvatarFallback className="text-xs">{getInitials(s.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{s.headline}</p>
                </div>
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    selected ? "border-primary bg-primary text-primary-foreground" : "border-border text-transparent"
                  )}
                >
                  {selected && <Check size={12} />}
                </div>
              </button>
            )
          })}
          {filteredStrategists.length === 0 && (
            <div className="py-8 text-center text-xs text-muted-foreground">No people found</div>
          )}
        </div>
      </ChatPanel>
    )
  }

  // ── Conversation list view (default) ──
  if (!minimized) {
    return (
      <>
        <div
          className="fixed bottom-4 right-4 z-50 flex w-[340px] flex-col rounded-xl border border-border bg-background shadow-2xl sm:w-[360px]"
          style={{ height: "480px", animation: "chatSlideIn 0.2s ease-out" }}
        >
          <style>{`
            @keyframes chatSlideIn {
              from { opacity: 0; transform: translateY(12px) scale(0.97); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
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
              <button onClick={openNewGroup} title="New group chat" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                <Users size={14} />
              </button>
              <button onClick={() => setMinimized(true)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                <Minus size={14} />
              </button>
              <button onClick={() => { setMinimized(true); setView("list"); setActiveConvId(null) }} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
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
            {filteredConversations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <MessageSquare size={24} className="mb-2 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
              </div>
            )}
            {filteredConversations.map((conv) => {
              const displayName = getConvDisplayName(conv)
              const displayImage = getConvDisplayImage(conv)
              return (
                <button
                  key={conv.id}
                  onClick={() => openChat(conv.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="relative shrink-0">
                    {conv.isGroup ? (
                      <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                        <Users size={16} className="text-white" />
                      </div>
                    ) : (
                      <Avatar size="sm">
                        {displayImage && (
                          <img src={displayImage} alt="" className="h-full w-full object-cover" />
                        )}
                        <AvatarFallback className="text-xs">{getInitials(displayName)}</AvatarFallback>
                      </Avatar>
                    )}
                    {conv.unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn("text-sm truncate", conv.unreadCount > 0 ? "font-semibold" : "font-medium")}>
                        {displayName}
                      </p>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{formatTime(conv.lastMessageAt)}</span>
                    </div>
                    <p className={cn("text-xs truncate", conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
                      {conv.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => setMinimized(true)}
          className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40 active:scale-95"
        >
          <X size={22} />
        </button>
      </>
    )
  }

  // ── Minimized: FAB only ──
  return (
    <button
      onClick={() => setMinimized(false)}
      className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40 active:scale-95"
    >
      <MessageSquare size={22} />
      {totalUnread > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {totalUnread > 9 ? "9+" : totalUnread}
        </span>
      )}
    </button>
  )
}
