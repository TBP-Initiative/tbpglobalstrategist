"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

interface TooltipContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  delayDuration: number
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null)

function useTooltipContext() {
  const ctx = React.useContext(TooltipContext)
  if (!ctx) throw new Error("Tooltip components must be used within a Tooltip provider")
  return ctx
}

interface TooltipProps {
  delayDuration?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Tooltip = ({
  delayDuration = 300,
  open: controlledOpen,
  onOpenChange,
  children,
}: TooltipProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setUncontrolledOpen(value)
      onOpenChange?.(value)
    },
    [isControlled, onOpenChange]
  )

  return (
    <TooltipContext.Provider value={{ open, setOpen, delayDuration }}>
      {children}
    </TooltipContext.Provider>
  )
}

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const TooltipTrigger = React.forwardRef<HTMLDivElement, TooltipTriggerProps>(
  ({ className, asChild = false, children, ...props }, ref) => {
    const { open, setOpen, delayDuration } = useTooltipContext()
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>()

    const handleMouseEnter = () => {
      timeoutRef.current = setTimeout(() => setOpen(true), delayDuration)
    }

    const handleMouseLeave = () => {
      clearTimeout(timeoutRef.current)
      setOpen(false)
    }

    const handleFocus = () => setOpen(true)
    const handleBlur = () => setOpen(false)

    if (asChild) {
      return (
        <div
          ref={ref}
          className={cn("inline-flex", className)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-describedby={open ? "tooltip" : undefined}
          {...props}
        >
          {children}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn("inline-flex", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={open ? "tooltip" : undefined}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TooltipTrigger.displayName = "TooltipTrigger"

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  sideOffset?: number
}

const sideClasses: Record<string, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
}

const sideAnimation: Record<string, { initial: object; animate: object; exit: object }> = {
  top: {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 4 },
  },
  bottom: {
    initial: { opacity: 0, y: -4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
  },
  left: {
    initial: { opacity: 0, x: 4 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 4 },
  },
  right: {
    initial: { opacity: 0, x: -4 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -4 },
  },
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, side = "top", align = "center", sideOffset = 0, ...props }, ref) => {
    const { open } = useTooltipContext()
    const alignClass = align === "start" ? "left-0 -translate-x-0" : align === "end" ? "right-0 translate-x-0" : ""
    const animation = sideAnimation[side]

    return (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            id="tooltip"
            role="tooltip"
            initial={animation.initial}
            animate={animation.animate}
            exit={animation.exit}
            transition={{ duration: 0.15 }}
            style={{ marginTop: side === "bottom" ? sideOffset : undefined, marginBottom: side === "top" ? sideOffset : undefined, marginLeft: side === "right" ? sideOffset : undefined, marginRight: side === "left" ? sideOffset : undefined }}
            className={cn(
              "absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
              "pointer-events-none",
              sideClasses[side],
              alignClass,
              className
            )}
            {...props}
          />
        )}
      </AnimatePresence>
    )
  }
)
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent }
