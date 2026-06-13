"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  from?: string
  via?: string
  to?: string
  direction?: "to-r" | "to-l" | "to-t" | "to-b" | "to-tr" | "to-tl" | "to-br" | "to-bl"
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p"
}

const directionClasses = {
  "to-r": "bg-gradient-to-r",
  "to-l": "bg-gradient-to-l",
  "to-t": "bg-gradient-to-t",
  "to-b": "bg-gradient-to-b",
  "to-tr": "bg-gradient-to-tr",
  "to-tl": "bg-gradient-to-tl",
  "to-br": "bg-gradient-to-br",
  "to-bl": "bg-gradient-to-bl",
}

const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
  (
    {
      className,
      from = "from-blue-600",
      via,
      to = "to-cyan-500",
      direction = "to-r",
      as: Component = "span",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "inline-block bg-clip-text text-transparent",
          directionClasses[direction],
          from,
          via,
          to,
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
GradientText.displayName = "GradientText"

export { GradientText }
