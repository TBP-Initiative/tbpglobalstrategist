"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: "sm" | "md" | "lg" | "xl"
  intensity?: "light" | "medium" | "heavy"
  hover?: boolean
}

const blurClasses = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
}

const intensityClasses = {
  light: "bg-white/30 dark:bg-black/20",
  medium: "bg-white/50 dark:bg-black/40",
  heavy: "bg-white/70 dark:bg-black/60",
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      blur = "md",
      intensity = "medium",
      hover = false,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-white/20 dark:border-white/10 shadow-xl",
        blurClasses[blur],
        intensityClasses[intensity],
        hover &&
          "transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] hover:border-white/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
GlassCard.displayName = "GlassCard"

export { GlassCard }
