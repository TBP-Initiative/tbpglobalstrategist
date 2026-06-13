"use client"

import * as React from "react"
import Link from "next/link"
import { Building2, MapPin, Users, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { GlassCard } from "@/components/shared/glass-card"
import { Badge } from "@/components/ui/badge"

interface OrganizationCardProps {
  id: string
  name: string
  slug: string
  description: string
  logo: string | null
  industry: string
  size: string | null
  location: string | null
  memberCount?: number
  isVerified?: boolean
  className?: string
}

const OrganizationCard = React.forwardRef<HTMLDivElement, OrganizationCardProps>(
  (
    {
      id,
      name,
      slug,
      description,
      logo,
      industry,
      size,
      location,
      memberCount = 0,
      isVerified = false,
      className,
    },
    ref
  ) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()

    return (
      <Link href={`/corporates/${id}`} className="block group">
        <GlassCard
          ref={ref}
          hover
          className={cn("p-6", className)}
        >
          <div className="flex items-start gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
              {logo ? (
                <img
                  src={logo}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-semibold group-hover:text-primary transition-colors">
                  {name}
                </h3>
                {isVerified && (
                  <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" />
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {industry}
            </Badge>
            {size && (
              <Badge variant="outline" className="text-xs">
                {size}
              </Badge>
            )}
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {memberCount.toLocaleString()} members
            </span>
          </div>
        </GlassCard>
      </Link>
    )
  }
)
OrganizationCard.displayName = "OrganizationCard"

export { OrganizationCard }
