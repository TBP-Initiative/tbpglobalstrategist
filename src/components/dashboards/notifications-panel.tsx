"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { GlassCard } from "@/components/shared/glass-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  Bell,
  CheckCheck,
  X,
  AlertCircle,
  Award,
  Calendar,
  Flag,
  Info,
  type LucideIcon,
} from "lucide-react"

interface Notification {
  id: string
  type: "info" | "warning" | "achievement" | "reminder" | "alert"
  title: string
  description: string
  timestamp: Date
  read: boolean
}

interface NotificationsPanelProps {
  items: Notification[]
  className?: string
  onMarkRead?: (id: string) => void
  onMarkAllRead?: () => void
  onDismiss?: (id: string) => void
}

const notificationIcons: Record<Notification["type"], LucideIcon> = {
  info: Info,
  warning: AlertCircle,
  achievement: Award,
  reminder: Calendar,
  alert: Flag,
}

const notificationColors: Record<Notification["type"], string> = {
  info: "text-blue-500 bg-blue-500/10",
  warning: "text-amber-500 bg-amber-500/10",
  achievement: "text-purple-500 bg-purple-500/10",
  reminder: "text-cyan-500 bg-cyan-500/10",
  alert: "text-red-500 bg-red-500/10",
}

export function NotificationsPanel({
  items,
  className,
  onMarkRead,
  onMarkAllRead,
  onDismiss,
}: NotificationsPanelProps) {
  const [localItems, setLocalItems] = useState(items)

  const displayItems = onMarkRead ? items : localItems
  const unreadCount = displayItems.filter((n) => !n.read).length

  const handleMarkRead = (id: string) => {
    if (onMarkRead) {
      onMarkRead(id)
    } else {
      setLocalItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      )
    }
  }

  const handleMarkAllRead = () => {
    if (onMarkAllRead) {
      onMarkAllRead()
    } else {
      setLocalItems((prev) => prev.map((n) => ({ ...n, read: true })))
    }
  }

  const handleDismiss = (id: string) => {
    if (onDismiss) {
      onDismiss(id)
    } else {
      setLocalItems((prev) => prev.filter((n) => n.id !== id))
    }
  }

  return (
    <GlassCard className={cn("p-6", className)} intensity="light">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            className="h-7 gap-1 text-xs text-muted-foreground"
          >
            <CheckCheck size={12} />
            Mark all read
          </Button>
        )}
      </div>
      <ScrollArea className="h-[400px] pr-2">
        <AnimatePresence mode="popLayout">
          {displayItems.map((notification, index) => {
            const Icon = notificationIcons[notification.type]
            return (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "group relative flex gap-3 rounded-xl p-3 transition-colors",
                  !notification.read && "bg-primary/5",
                  "hover:bg-muted/50",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    notificationColors[notification.type],
                  )}
                >
                  <Icon size={14} />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm leading-tight",
                        !notification.read && "font-semibold",
                      )}
                    >
                      {notification.title}
                    </p>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {formatDistanceToNow(notification.timestamp, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {notification.description}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkRead(notification.id)}
                        className="text-[10px] font-medium text-primary opacity-0 transition-opacity hover:underline group-hover:opacity-100"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDismiss(notification.id)}
                  className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-fg group-hover:opacity-100"
                >
                  <X size={10} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {displayItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell size={24} className="mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        )}
      </ScrollArea>
    </GlassCard>
  )
}
