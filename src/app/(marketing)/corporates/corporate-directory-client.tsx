"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2,
  ChevronDown,
  Filter,
  Search,
  SortAsc,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/shared/page-header"
import { SearchInput } from "@/components/shared/search-input"
import { GlassCard } from "@/components/shared/glass-card"
import { GradientText } from "@/components/shared/gradient-text"
import { AnimatedSection } from "@/components/shared/animated-section"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import { OrganizationCard } from "@/components/cards/organization-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import type { CorporateItem } from "./page"

interface CorporateDirectoryClientProps {
  corporates: CorporateItem[]
  sizes: string[]
  itemsPerPage: number
}

const INDUSTRIES = [
  "All Industries",
  "Technology & Software",
  "Financial Services",
  "Healthcare & Life Sciences",
  "Manufacturing & Industrial",
  "Energy & Utilities",
  "Consumer Goods & Retail",
  "Media & Telecommunications",
  "Transportation & Logistics",
  "Education & Research",
  "Government & Public Sector",
  "Real Estate & Construction",
  "Agriculture & Food",
  "Pharmaceuticals",
  "Aerospace & Defense",
  "Hospitality & Tourism",
] as const

const SORT_OPTIONS = [
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
  { label: "Members (High-Low)", value: "members-desc" },
  { label: "Members (Low-High)", value: "members-asc" },
] as const

function CorporateDirectoryClient({
  corporates,
  sizes,
  itemsPerPage,
}: CorporateDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedIndustry, setSelectedIndustry] = React.useState("All Industries")
  const [selectedSize, setSelectedSize] = React.useState("All Sizes")
  const [verifiedOnly, setVerifiedOnly] = React.useState(false)
  const [sortBy, setSortBy] = React.useState("name-asc")
  const [page, setPage] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const featured = corporates.filter((c) => c.isFeatured)

  const filtered = React.useMemo(() => {
    try {
      let result = [...corporates]

      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        result = result.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.industry.toLowerCase().includes(q) ||
            (c.location && c.location.toLowerCase().includes(q))
        )
      }

      if (selectedIndustry !== "All Industries") {
        result = result.filter((c) => c.industry === selectedIndustry)
      }

      if (selectedSize !== "All Sizes") {
        result = result.filter((c) => c.size === selectedSize)
      }

      if (verifiedOnly) {
        result = result.filter((c) => c.isVerified)
      }

      switch (sortBy) {
        case "name-asc":
          result.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "name-desc":
          result.sort((a, b) => b.name.localeCompare(a.name))
          break
        case "members-desc":
          result.sort((a, b) => b.memberCount - a.memberCount)
          break
        case "members-asc":
          result.sort((a, b) => a.memberCount - b.memberCount)
          break
      }

      return result
    } catch {
      setError("Failed to filter organizations")
      return corporates
    }
  }, [corporates, searchQuery, selectedIndustry, selectedSize, verifiedOnly, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setPage(1)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setPage(1)
  }

  const activeFilters =
    (selectedIndustry !== "All Industries" ? 1 : 0) +
    (selectedSize !== "All Sizes" ? 1 : 0) +
    (verifiedOnly ? 1 : 0)

  const resetFilters = () => {
    setSelectedIndustry("All Industries")
    setSelectedSize("All Sizes")
    setVerifiedOnly(false)
    setPage(1)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="rounded-full bg-destructive/10 p-4">
          <Building2 className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Error Loading Organizations</h2>
        <p className="text-sm text-muted-foreground max-w-md text-center">
          {error}
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setError(null)
            setIsLoading(true)
            setTimeout(() => setIsLoading(false), 300)
          }}
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* ── Hero Section ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-primary/[0.02] to-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
        <div className="container relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <GradientText
              as="h1"
              from="from-primary"
              to="to-purple-500"
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Partner Organizations
            </GradientText>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Discover leading enterprises and institutions driving innovation
              alongside our global network of strategists.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="mx-auto mt-10 max-w-xl">
            <div className="relative">
              <SearchInput
                value={searchQuery}
                onChange={handleSearch}
                onClear={handleClearSearch}
                placeholder="Search organizations by name, industry, or location..."
                className="h-12 text-base shadow-lg shadow-primary/5"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Featured Section ────────────────────────────────────────── */}
      {featured.length > 0 && !searchQuery && (
        <section className="container mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center gap-2 mb-8">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <h2 className="text-xl font-semibold">Featured Organizations</h2>
            </div>
          </AnimatedSection>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {featured.map((org, i) => (
                <motion.div
                  key={org.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <OrganizationCard {...org} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* ── Filters & Directory ─────────────────────────────────────── */}
      <section className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <AnimatedSection delay={0.1}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <PageHeader
              title="All Organizations"
              description={`${filtered.length} organization${filtered.length !== 1 ? "s" : ""} found`}
            />
          </div>
        </AnimatedSection>

        {/* Filter bar */}
        <AnimatedSection delay={0.15} className="mt-6">
          <GlassCard intensity="light" className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilters > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                    {activeFilters}
                  </Badge>
                )}
              </div>

              <Separator orientation="vertical" className="hidden h-6 sm:block" />

              <Select value={selectedIndustry} onValueChange={(v) => { setSelectedIndustry(v); setPage(1) }}>
                <SelectTrigger placeholder="Industry" className="h-8 w-[180px] text-xs" />
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSize} onValueChange={(v) => { setSelectedSize(v); setPage(1) }}>
                <SelectTrigger placeholder="Company Size" className="h-8 w-[150px] text-xs" />
                <SelectContent>
                  <SelectItem value="All Sizes">All Sizes</SelectItem>
                  {sizes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s} employees
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={verifiedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => { setVerifiedOnly(!verifiedOnly); setPage(1) }}
                className="h-8 text-xs"
              >
                <Building2 className="mr-1 h-3.5 w-3.5" />
                Verified Only
              </Button>

              <div className="ml-auto flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger placeholder="Sort" className="h-8 w-[170px] text-xs">
                    <SortAsc className="mr-1 h-3.5 w-3.5" />
                    <span>
                      {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {activeFilters > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 text-xs text-muted-foreground"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Results */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <LoadingSpinner size="lg" text="Loading organizations..." />
            </div>
          ) : paginated.length === 0 ? (
            <EmptyState
              icon={<Building2 className="h-6 w-6" />}
              title="No organizations found"
              description={
                searchQuery || activeFilters > 0
                  ? "Try adjusting your search or filters."
                  : "No organizations are available yet."
              }
              action={
                (searchQuery || activeFilters > 0) && (
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                )
              }
            />
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {paginated.map((org, i) => (
                    <motion.div
                      key={org.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <OrganizationCard {...org} />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage <= 1}
                    onClick={() => setPage(safePage - 1)}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Button
                        key={p}
                        variant={p === safePage ? "default" : "outline"}
                        size="sm"
                        className="min-w-[36px]"
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage(safePage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export { CorporateDirectoryClient }
