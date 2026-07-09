"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { GlassCard } from "@/components/shared/glass-card"
import { Button } from "@/components/ui/button"
import {
  Bell,
  CheckCheck,
  X,
  MessageSquare,
  Shield,
  Award,
  Info,
  AlertTriangle,
} from "lucide-react"

type RawNotification = {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  link: string | null
  createdAt: string
}

const iconMap: Record<string, React.ReactNode> = {
  SYSTEM: <Info size={16} />,
  MESSAGE: <MessageSquare size={16} />,
  PROJECT_INVITE: <Shield size={16} />,
  ORGANIZATION_INVITE: <Shield size={16} />,
  ACHIEVEMENT_UNLOCKED: <Award size={16} />,
  PUBLICATION_APPROVED: <Info size={16} />,
}

const colorMap: Record<string, string> = {
  SYSTEM: "text-blue-500 bg-blue-500/10",
  MESSAGE: "text-purple-500 bg-purple-500/10",
  PROJECT_INVITE: "text-amber-500 bg-amber-500/10",
  ORGANIZATION_INVITE: "text-amber-500 bg-amber-500/10",
  ACHIEVEMENT_UNLOCKED: "text-green-500 bg-green-500/10",
  PUBLICATION_APPROVED: "text-cyan-500 bg-cyan-500/10",
}

export default function NotificationsClient() {
  const [items, setItems] = useState<RawNotification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications")
      if (res.ok) {
        const data = await res.json()
        setItems(data.items ?? data)
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  async function markRead(id: string) {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      })
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } catch {
      /* ignore */
    }
  }

  async function markAllRead() {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      })
      setItems((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch {
      /* ignore */
    }
  }

  async function dismiss(id: string) {
    try {
      await fetch(`/api/notifications`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      setItems((prev) => prev.filter((n) => n.id !== id))
    } catch {
      setItems((prev) => prev.filter((n) => n.id !== id))
    }
  }

  const unreadCount = items.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
            <CheckCheck size={14} />
            Mark all read
          </Button>
        )}
      </div>

      <GlassCard intensity="light" className="p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bell size={32} className="mb-3 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            <AnimatePresence mode="popLayout">
              {items.map((n) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={cn(
                    "group relative flex items-start gap-4 px-6 py-4 transition-colors",
                    !n.read && "bg-primary/[0.03]",
                    "hover:bg-muted/40",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      colorMap[n.type] ?? "text-muted-foreground bg-muted",
                    )}
                  >
                    {iconMap[n.type] ?? <Info size={16} />}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-start justify-between gap-4">
                      <p
                        className={cn(
                          "text-sm leading-tight",
                          !n.read && "font-semibold",
                        )}
                      >
                        {n.title}
                      </p>
                      <span className="shrink-0 text-[11px] text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(n.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="text-[11px] font-medium text-primary opacity-0 transition-opacity hover:underline group-hover:opacity-100"
                      >
                        Mark read
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => dismiss(n.id)}
                    className="absolute right-3 top-4 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
