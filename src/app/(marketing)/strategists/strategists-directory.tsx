"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown, ArrowUpDown, Users, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/glass-card";
import { GradientText } from "@/components/shared/gradient-text";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/empty-state";
import type { StrategistProfile } from "@/data/strategists";

const stageColors: Record<string, string> = {
  CANDIDATE: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  STRATEGIST: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400",
  CONTRIBUTOR: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  PROJECT_ALIGNED: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  SECTOR_LEAD: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  PAID_ADVISER: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
};

const stageLabels: Record<string, string> = {
  CANDIDATE: "Global Strategist Candidate",
  STRATEGIST: "Global Strategist",
  CONTRIBUTOR: "Strategic Contributor",
  PROJECT_ALIGNED: "Project-Aligned Strategist",
  SECTOR_LEAD: "Sector Lead or Workstream Lead",
  PAID_ADVISER: "Paid Project Adviser, Specialist or Implementation Contributor",
};

const badgeColors: Record<string, string> = {
  "TBP Global Strategist": "border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25",
};

const collaborationStatusColors: Record<string, string> = {
  open: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  limited: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  closed: "text-red-500 bg-red-500/10 border-red-500/20",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getGradient(id: string) {
  const gradients = [
    "bg-gradient-to-br from-violet-500 to-purple-600",
    "bg-gradient-to-br from-blue-500 to-cyan-500",
    "bg-gradient-to-br from-emerald-500 to-teal-500",
    "bg-gradient-to-br from-amber-500 to-orange-500",
    "bg-gradient-to-br from-rose-500 to-pink-500",
    "bg-gradient-to-br from-indigo-500 to-violet-500",
    "bg-gradient-to-br from-teal-500 to-cyan-500",
    "bg-gradient-to-br from-fuchsia-500 to-violet-500",
  ];
  return gradients[Math.abs(id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % gradients.length];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 80, damping: 15 },
  },
};

const ITEMS_PER_PAGE = 9;

interface StrategistsDirectoryProps {
  initialStrategists: StrategistProfile[];
  expertiseAreas: string[];
  industries: string[];
}

function StrategistCard({ strategist, index }: { strategist: StrategistProfile; index: number }) {
  const [imgError, setImgError] = React.useState(false);
  const initials = strategist.name
    ? strategist.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <motion.div variants={cardVariants} custom={index}>
      <Link href={`/strategists/${strategist.id}`} className="block group">
        <GlassCard
          hover
          intensity="light"
          blur="lg"
          className="relative flex h-full flex-col overflow-hidden p-6 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10 flex flex-1 flex-col">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full overflow-hidden ring-2 ring-white/20 shadow-lg bg-muted">
                {strategist.avatar && !imgError ? (
                  <img
                    src={strategist.avatar}
                    alt={strategist.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">{initials}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-semibold leading-tight">{strategist.name}</h3>
                <p className="truncate text-sm text-muted-foreground">{strategist.headline}</p>
              </div>
            </div>

            <Badge className={cn("mb-3 w-fit text-[10px] uppercase tracking-wider", strategist.stage ? stageColors[strategist.stage] : badgeColors[strategist.badge])}>
              {strategist.stage ? stageLabels[strategist.stage] : strategist.badge}
            </Badge>

            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {strategist.shortBio}
            </p>

            <div className="mb-4 flex flex-1 flex-wrap content-start gap-1.5">
              {strategist.expertiseAreas.slice(0, 3).map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-primary"
                >
                  {area}
                </span>
              ))}
              {strategist.expertiseAreas.length > 3 && (
                <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground">
                  +{strategist.expertiseAreas.length - 3}
                </span>
              )}
            </div>

            <Separator className="mb-4" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {strategist.affiliation ? (
                  <>
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-muted text-[9px] font-bold">
                      {strategist.affiliation.logo}
                    </div>
                    <span className="truncate max-w-[120px]">{strategist.affiliation.organization}</span>
                  </>
                ) : (
                  <span className="italic">Independent</span>
                )}
              </div>
              <div
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                  collaborationStatusColors[strategist.collaborationStatus]
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {strategist.collaborationStatus}
              </div>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}

export function StrategistsDirectory({ initialStrategists, expertiseAreas, industries }: StrategistsDirectoryProps) {
  const allStrategists = initialStrategists;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedExpertise, setSelectedExpertise] = React.useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = React.useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState("newest");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [expertiseOpen, setExpertiseOpen] = React.useState(true);
  const [industriesOpen, setIndustriesOpen] = React.useState(true);
  const [statusOpen, setStatusOpen] = React.useState(true);

  const isFilterActive = selectedExpertise.length > 0 || selectedIndustries.length > 0 || selectedStatus.length > 0;

  const filtered = React.useMemo(() => {
    let result = [...allStrategists];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.headline.toLowerCase().includes(q) ||
          s.shortBio.toLowerCase().includes(q) ||
          s.expertiseAreas.some((a) => a.toLowerCase().includes(q)) ||
          s.industries.some((i) => i.toLowerCase().includes(q))
      );
    }

    if (selectedExpertise.length > 0) {
      result = result.filter((s) => s.expertiseAreas.some((a) => selectedExpertise.includes(a)));
    }

    if (selectedIndustries.length > 0) {
      result = result.filter((s) => s.industries.some((i) => selectedIndustries.includes(i)));
    }

    if (selectedStatus.length > 0) {
      result = result.filter((s) => selectedStatus.includes(s.collaborationStatus));
    }

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "most-active":
        result.sort((a, b) => b.stats.projects - a.stats.projects);
        break;
      case "alphabetical":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [searchQuery, selectedExpertise, selectedIndustries, selectedStatus, sortBy, allStrategists]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const toggleFilter = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const clearAllFilters = () => {
    setSelectedExpertise([]);
    setSelectedIndustries([]);
    setSelectedStatus([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const badgeWithDot = (status: string) => (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          status === "open" && "bg-emerald-500",
          status === "limited" && "bg-amber-500",
          status === "closed" && "bg-red-500"
        )}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  return (
    <div className="min-h-screen">
      <section className="gradient-hero relative overflow-hidden px-4 pb-24 pt-24 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <GradientText
              as="h1"
              from="from-white"
              via="via-primary/80"
              to="to-white"
              className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Global Strategists
            </GradientText>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400">
              Connect with the world&apos;s most visionary strategists. Discover expertise, explore collaborations,
              and shape the future of business.
            </p>
            <div className="mx-auto max-w-2xl">
              <div className="glass-strong relative flex items-center gap-3 rounded-2xl p-2 pl-5 shadow-2xl shadow-primary/10">
                <Search className="h-5 w-5 shrink-0 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by name, expertise, industry..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mr-1 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative -mt-12 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-8">
            <aside className="hidden shrink-0 lg:block lg:w-64">
              <GlassCard intensity="heavy" blur="xl" className="sticky top-24 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <Filter className="h-4 w-4" />
                    Filters
                  </h3>
                  {isFilterActive && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="text-xs text-primary transition-colors hover:text-primary/80"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => setExpertiseOpen(!expertiseOpen)}
                    className="flex w-full items-center justify-between py-2 text-sm font-medium"
                  >
                    Expertise Areas
                    <ChevronDown
                      className={cn("h-3.5 w-3.5 transition-transform", expertiseOpen && "rotate-180")}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {expertiseOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pb-2 pt-1">
                          {expertiseAreas.map((area) => (
                            <label
                              key={area}
                              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                            >
                              <input
                                type="checkbox"
                                checked={selectedExpertise.includes(area)}
                                onChange={() => {
                                  setSelectedExpertise((prev) => toggleFilter(prev, area));
                                  setCurrentPage(1);
                                }}
                                className="h-4 w-4 rounded border-border bg-transparent text-primary focus:ring-primary/30"
                              />
                              <span className="text-muted-foreground">{area}</span>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Separator />

                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => setIndustriesOpen(!industriesOpen)}
                    className="flex w-full items-center justify-between py-2 text-sm font-medium"
                  >
                    Industries
                    <ChevronDown
                      className={cn("h-3.5 w-3.5 transition-transform", industriesOpen && "rotate-180")}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {industriesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pb-2 pt-1">
                          {industries.map((industry) => (
                            <label
                              key={industry}
                              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                            >
                              <input
                                type="checkbox"
                                checked={selectedIndustries.includes(industry)}
                                onChange={() => {
                                  setSelectedIndustries((prev) => toggleFilter(prev, industry));
                                  setCurrentPage(1);
                                }}
                                className="h-4 w-4 rounded border-border bg-transparent text-primary focus:ring-primary/30"
                              />
                              <span className="text-muted-foreground">{industry}</span>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Separator />

                <div>
                  <button
                    type="button"
                    onClick={() => setStatusOpen(!statusOpen)}
                    className="flex w-full items-center justify-between py-2 text-sm font-medium"
                  >
                    Collaboration Status
                    <ChevronDown
                      className={cn("h-3.5 w-3.5 transition-transform", statusOpen && "rotate-180")}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {statusOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pb-2 pt-1">
                          {["open", "limited", "closed"].map((status) => (
                            <label
                              key={status}
                              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                            >
                              <input
                                type="checkbox"
                                checked={selectedStatus.includes(status)}
                                onChange={() => {
                                  setSelectedStatus((prev) => toggleFilter(prev, status));
                                  setCurrentPage(1);
                                }}
                                className="h-4 w-4 rounded border-border bg-transparent text-primary focus:ring-primary/30"
                              />
                              <span className="text-muted-foreground">
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </span>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GlassCard>
            </aside>

            <div className="flex-1">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                    {filtered.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isFilterActive || searchQuery ? (
                      <>
                        <span className="font-medium text-foreground">{filtered.length}</span> result
                        {filtered.length !== 1 && "s"}
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-foreground">{allStrategists.length}</span> strategists
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {isFilterActive && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                        {selectedExpertise.length + selectedIndustries.length + selectedStatus.length}
                      </span>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-9 w-[140px] rounded-md border border-border bg-transparent px-3 text-sm text-white outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="newest">Newest</option>
                      <option value="most-active">Most Active</option>
                      <option value="alphabetical">Alphabetical</option>
                    </select>
                  </div>
                </div>
              </div>

              {paginated.length > 0 ? (
                <>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    key={`${currentPage}-${searchQuery}-${selectedExpertise.join()}-${selectedIndustries.join()}-${selectedStatus.join()}`}
                    className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                  >
                    {paginated.map((strategist, i) => (
                      <StrategistCard key={strategist.id} strategist={strategist} index={i} />
                    ))}
                  </motion.div>

                  {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => setCurrentPage(page)}
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                              page === currentPage
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <AnimatedSection direction="up" className="py-20">
                  <EmptyState
                    icon={<Users className="h-6 w-6" />}
                    title="No strategists found"
                    description={
                      searchQuery || isFilterActive
                        ? "No strategists match your current filters. Try adjusting your search criteria."
                        : "No strategists are available yet. Check back soon."
                    }
                    action={
                      (searchQuery || isFilterActive) && (
                        <Button variant="outline" onClick={clearAllFilters}>
                          Clear all filters
                        </Button>
                      )
                    }
                  />
                </AnimatedSection>
              )}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-border bg-background p-6 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 overflow-y-auto">
                <div>
                  <h4 className="mb-3 text-sm font-medium">Expertise Areas</h4>
                  <div className="space-y-1">
                    {expertiseAreas.map((area) => (
                      <label
                        key={area}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                      >
                        <input
                          type="checkbox"
                          checked={selectedExpertise.includes(area)}
                          onChange={() => {
                            setSelectedExpertise((prev) => toggleFilter(prev, area));
                            setCurrentPage(1);
                          }}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                        />
                        <span className="text-muted-foreground">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3 text-sm font-medium">Industries</h4>
                  <div className="space-y-1">
                    {industries.map((industry) => (
                      <label
                        key={industry}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                      >
                        <input
                          type="checkbox"
                          checked={selectedIndustries.includes(industry)}
                          onChange={() => {
                            setSelectedIndustries((prev) => toggleFilter(prev, industry));
                            setCurrentPage(1);
                          }}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                        />
                        <span className="text-muted-foreground">{industry}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3 text-sm font-medium">Collaboration Status</h4>
                  <div className="space-y-1">
                    {["open", "limited", "closed"].map((status) => (
                      <label
                        key={status}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStatus.includes(status)}
                          onChange={() => {
                            setSelectedStatus((prev) => toggleFilter(prev, status));
                            setCurrentPage(1);
                          }}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                        />
                        <span className="text-muted-foreground">
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    clearAllFilters();
                    setSidebarOpen(false);
                  }}
                >
                  Clear All
                </Button>
                <Button className="flex-1" onClick={() => setSidebarOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
