"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { GlassCard } from "@/components/shared/glass-card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  trend?: { value: number; positive: boolean }
  description?: string
  className?: string
  delay?: number
}

export function StatsCard({
  icon,
  label,
  value,
  trend,
  description,
  className,
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    >
      <GlassCard className={cn("p-6", className)} hover intensity="light">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
          {trend && (
            <span
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend.positive ? "text-green-500" : "text-red-500",
              )}
            >
              {trend.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {trend.value}%
            </span>
          )}
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
        {description && (
          <p className="mt-2 text-xs text-muted-foreground/80">{description}</p>
        )}
      </GlassCard>
    </motion.div>
  )
}
