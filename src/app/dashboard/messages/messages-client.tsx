"use client"

import { useState, useMemo } from "react"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { StatsCard } from "@/components/dashboards/stats-card"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MessageSquare,
  Send,
  Search,
  Mail,
  MailOpen,
  Trash2,
  CornerUpRight,
  Clock,
  User,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type MessageData = {
  id: string
  content: string
  read: boolean
  createdAt: string
  sender: { id: string; name: string | null; email: string }
  receiver: { id: string; name: string | null; email: string }
  isSentByMe: boolean
}

export function MessagesClient({
  messages,
  currentUserId,
  currentUserName,
}: {
  messages: MessageData[]
  currentUserId: string
  currentUserName: string
}) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "unread" | "sent">("all")

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      if (filter === "unread" && (m.read || m.isSentByMe)) return false
      if (filter === "sent" && !m.isSentByMe) return false
      if (search) {
        const q = search.toLowerCase()
        const other = m.isSentByMe ? m.receiver : m.sender
        return (
          (m.content ?? "").toLowerCase().includes(q) ||
          (other.name ?? "").toLowerCase().includes(q) ||
          (other.email ?? "").toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [messages, filter, search])

  const unreadCount = messages.filter((m) => !m.read && !m.isSentByMe).length
  const sentCount = messages.filter((m) => m.isSentByMe).length

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <PageHeader title="Messages" description="View and manage your conversations" />
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard icon={<MessageSquare size={18} />} label="Total" value={String(messages.length)} delay={0} />
        <StatsCard icon={<Mail size={18} />} label="Unread" value={String(unreadCount)} delay={0.05} />
        <StatsCard icon={<Send size={18} />} label="Sent" value={String(sentCount)} delay={0.1} />
      </div>

      <AnimatedSection delay={0.2}>
        <GlassCard className="p-6" intensity="light">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-muted-foreground" />
              <h2 className="text-lg font-semibold">Inbox</h2>
              <Badge variant="outline" className="text-[10px] px-1.5">{filtered.length} of {messages.length}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 rounded-lg border border-border bg-muted pl-8 pr-3 text-xs text-fg placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex gap-1">
                {(["all", "unread", "sent"] as const).map((f) => (
                  <Button
                    key={f}
                    type="button"
                    variant={filter === f ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilter(f)}
                    className="h-7 text-xs capitalize"
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {filtered.length > 0 ? (
              filtered.map((msg) => {
                const other = msg.isSentByMe ? msg.receiver : msg.sender
                const initials = other.name
                  ? other.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
                  : other.email.slice(0, 2).toUpperCase()

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/30 ${
                      !msg.read && !msg.isSentByMe ? "border-primary/30 bg-primary/5" : "border-border"
                    }`}
                  >
                    <Avatar size="sm">
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {other.name ?? other.email}
                          </span>
                          {!msg.read && !msg.isSentByMe && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                          {msg.isSentByMe && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 bg-muted">Sent</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock size={10} />
                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                          </span>
                          <Button type="button" variant="ghost" size="icon" className="h-6 w-6">
                            <CornerUpRight size={11} />
                          </Button>
                          <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-500">
                            <Trash2 size={11} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{msg.content}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12">
                <MessageSquare size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No messages found.</p>
              </div>
            )}
          </div>
        </GlassCard>
      </AnimatedSection>
    </div>
  )
}
