const categoryConfig: Record<string, { label: string; color: string; badgeClass: string }> = {
  "City & Regional Development": {
    label: "City & Regional Development",
    color: "blue",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  "Event Systems & Global Engagements": {
    label: "Event Systems & Global Engagements",
    color: "purple",
    badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
  "Infrastructure Systems": {
    label: "Infrastructure Systems",
    color: "teal",
    badgeClass: "bg-teal-500/10 text-teal-400 border-teal-500/30",
  },
  "NPNGS Protocols": {
    label: "NPNGS Protocols",
    color: "amber",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  "Software & Digital Platforms": {
    label: "Software & Digital Platforms",
    color: "emerald",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  "Sovereign & Multipolar Initiatives": {
    label: "Sovereign & Multipolar Initiatives",
    color: "rose",
    badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  },
}

export function getCategoryConfig(category: string) {
  return categoryConfig[category] ?? {
    label: category,
    color: "gray",
    badgeClass: "bg-muted text-muted-foreground border-border",
  }
}

export const ALL_CATEGORIES = Object.keys(categoryConfig)
