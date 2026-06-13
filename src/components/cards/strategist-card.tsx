"use client"

import * as React from "react"
import Link from "next/link"
import { Award, ExternalLink, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { GlassCard } from "@/components/shared/glass-card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface StrategistCardProps {
  id: string
  name: string
  title: string
  bio: string
  avatar: string | null
  expertiseAreas: string[]
  yearsOfExperience: number | null
  linkedIn: string | null
  website: string | null
  className?: string
  variant?: "default" | "compact"
}

const StrategistCard = React.forwardRef<HTMLDivElement, StrategistCardProps>(
  (
    {
      id,
      name,
      title,
      bio,
      avatar,
      expertiseAreas,
      yearsOfExperience,
      linkedIn,
      website,
      className,
      variant = "default",
    },
    ref
  ) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()

    if (variant === "compact") {
      return (
        <Link href={`/strategists/${id}`} className="block group">
          <GlassCard
            ref={ref}
            hover
            className={cn("p-4", className)}
          >
            <div className="flex items-center gap-3">
              <Avatar size="md">
                {avatar ? (
                  <AvatarImage src={avatar} alt={name} />
                ) : null}
                <AvatarFallback className="text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold group-hover:text-primary transition-colors">
                  {name}
                </h4>
                <p className="truncate text-xs text-muted-foreground">
                  {title}
                </p>
              </div>
              {yearsOfExperience && (
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-primary">
                    {yearsOfExperience}+
                  </span>
                  <span className="text-[10px] text-muted-foreground">years</span>
                </div>
              )}
            </div>
          </GlassCard>
        </Link>
      )
    }

    return (
      <Link href={`/strategists/${id}`} className="block group">
        <GlassCard
          ref={ref}
          hover
          className={cn("p-6", className)}
        >
          <div className="flex items-start gap-4">
            <Avatar size="lg">
              {avatar ? (
                <AvatarImage src={avatar} alt={name} />
              ) : null}
              <AvatarFallback className="font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground">{title}</p>
              {yearsOfExperience && (
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Award className="h-3.5 w-3.5" />
                  {yearsOfExperience}+ years experience
                </div>
              )}
            </div>
          </div>

          <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {bio}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {expertiseAreas.slice(0, 3).map((area) => (
              <Badge key={area} variant="secondary" className="text-[10px]">
                {area}
              </Badge>
            ))}
            {expertiseAreas.length > 3 && (
              <Badge variant="outline" className="text-[10px]">
                +{expertiseAreas.length - 3}
              </Badge>
            )}
          </div>

          {(linkedIn || website) && (
            <div className="mt-4 flex items-center gap-3">
              {linkedIn && (
                <a
                  href={linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Website"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </GlassCard>
      </Link>
    )
  }
)
StrategistCard.displayName = "StrategistCard"

export { StrategistCard }
