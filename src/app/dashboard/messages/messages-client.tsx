"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Search, Mail, MailOpen, Inbox } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type ConversationData = {
  id: string
  name: string
  image: string | null
  isGroup: boolean
  participants: { id: string; name: string | null; email: string; image: string | null }[]
  lastMessage: string | null
  lastMessageAt: string
  unreadCount: number
  lastSenderIsMe: boolean
}

export function MessagesClient({
  conversations,
}: {
  conversations: ConversationData[]
}) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      if (filter === "unread" && c.unreadCount === 0) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          (c.name ?? "").toLowerCase().includes(q) ||
          (c.lastMessage ?? "").toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [conversations, filter, search])

  const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <PageHeader title="Messages" description="Conversations with your assessor and collaborators" />
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <GlassCard className="p-6" intensity="light">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Inbox size={16} className="text-muted-foreground" />
              <h2 className="text-lg font-semibold">Conversations</h2>
              <Badge variant="outline" className="text-[10px] px-1.5">
                {filtered.length} of {conversations.length}
              </Badge>
              {unreadCount > 0 && (
                <Badge className="text-[10px] px-1.5">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 rounded-lg border border-border bg-muted pl-8 pr-3 text-xs text-fg placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex gap-1">
                {(["all", "unread"] as const).map((f) => (
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
              filtered.map((conv) => {
                const name = conv.name || "Conversation"
                const initials = name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()

                return (
                  <Link
                    key={conv.id}
                    href={`/dashboard/messages/${conv.id}`}
                    className={`flex items-start gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/30 ${
                      conv.unreadCount > 0 ? "border-primary/30 bg-primary/5" : "border-border"
                    }`}
                  >
                    <Avatar size="md">
                      {conv.image ? (
                        <img src={conv.image} alt={name} className="h-full w-full object-cover" />
                      ) : null}
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm font-medium truncate">{name}</span>
                          {conv.isGroup && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 bg-muted">Group</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {conv.unreadCount > 0 ? (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-primary">
                              <Mail size={10} />
                              {conv.unreadCount}
                            </span>
                          ) : (
                            <MailOpen size={10} className="text-muted-foreground/60" />
                          )}
                          {conv.lastMessage && (
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {conv.lastMessage
                          ? `${conv.lastSenderIsMe ? "You: " : ""}${conv.lastMessage}`
                          : "No messages yet"}
                      </p>
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="text-center py-12">
                <MessageSquare size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  {search || filter === "unread" ? "No conversations match." : "No conversations yet."}
                </p>
                {!search && filter === "all" && (
                  <p className="text-xs text-muted-foreground/70">
                    Message your assessor or collaborators to start a thread.
                  </p>
                )}
              </div>
            )}
          </div>
        </GlassCard>
      </AnimatedSection>
    </div>
  )
}