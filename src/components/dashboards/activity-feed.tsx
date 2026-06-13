"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { GlassCard } from "@/components/shared/glass-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Clock,
  CheckCircle2,
  PlusCircle,
  UserPlus,
  MessageSquare,
  Briefcase,
  type LucideIcon,
} from "lucide-react"

interface ActivityItem {
  id: string
  type: "project_created" | "project_completed" | "collaboration" | "message" | "profile_update"
  title: string
  description: string
  timestamp: Date
  user?: string
}

interface ActivityFeedProps {
  items: ActivityItem[]
  className?: string
  title?: string
}

const activityIcons: Record<ActivityItem["type"], LucideIcon> = {
  project_created: PlusCircle,
  project_completed: CheckCircle2,
  collaboration: UserPlus,
  message: MessageSquare,
  profile_update: Briefcase,
}

const activityColors: Record<ActivityItem["type"], string> = {
  project_created: "text-blue-500 bg-blue-500/10",
  project_completed: "text-green-500 bg-green-500/10",
  collaboration: "text-purple-500 bg-purple-500/10",
  message: "text-amber-500 bg-amber-500/10",
  profile_update: "text-cyan-500 bg-cyan-500/10",
}

export function ActivityFeed({ items, className, title = "Recent Activity" }: ActivityFeedProps) {
  return (
    <GlassCard className={cn("p-6", className)} intensity="light">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        <span className="text-xs text-muted-foreground">{items.length} events</span>
      </div>
      <ScrollArea className="h-[400px] pr-2">
        <div className="relative space-y-0">
          <div className="absolute left-[17px] top-2 h-[calc(100%-16px)] w-px bg-border" />
          {items.map((item, index) => {
            const Icon = activityIcons[item.type]
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="relative flex gap-4 pb-6 last:pb-0"
              >
                <div
                  className={cn(
                    "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    activityColors[item.type],
                  )}
                >
                  <Icon size={14} />
                </div>
                <div className="flex-1 space-y-1 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-tight">{item.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  {item.user && (
                    <p className="text-xs font-medium text-primary">by {item.user}</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </ScrollArea>
    </GlassCard>
  )
}
