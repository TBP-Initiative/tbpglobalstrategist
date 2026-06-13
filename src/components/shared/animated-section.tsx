"use client"

import * as React from "react"
import { motion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  duration?: number
  once?: boolean
  distance?: number
  variants?: Variants
}

const defaultVariants = (
  direction: string,
  distance: number
): Variants => ({
  hidden: {
    opacity: 0,
    x:
      direction === "left"
        ? -distance
        : direction === "right"
          ? distance
          : 0,
    y:
      direction === "up"
        ? distance
        : direction === "down"
          ? -distance
          : 0,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
})

const AnimatedSection = React.forwardRef<HTMLDivElement, AnimatedSectionProps>(
  (
    {
      className,
      children,
      delay = 0,
      direction = "up",
      duration = 0.5,
      once = true,
      distance = 40,
      variants,
      ...props
    },
    ref
  ) => {
    const resolvedVariants =
      variants ?? defaultVariants(direction, distance)

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-50px" }}
        variants={resolvedVariants}
        transition={{
          delay,
          duration,
          ease: "easeOut",
        }}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
AnimatedSection.displayName = "AnimatedSection"

export { AnimatedSection }
