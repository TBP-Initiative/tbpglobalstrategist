"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ChevronRight, ChevronLeft, Check, Info, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepTentativeProjectProps {
  data: Record<string, unknown> | null
  pathway?: string
  onNext: (data: Record<string, unknown>) => void
  onBack: () => void
}

interface ProjectOption {
  id: string
  title: string
  slug: string
  description: string
  category: string
}

export function StepTentativeProject({ data, pathway, onNext, onBack }: StepTentativeProjectProps) {
  const isRndPathway = pathway === "PLUS"

  const [projects, setProjects] = useState<ProjectOption[]>([])
  const [loading, setLoading] = useState(true)
  const [primaryId, setPrimaryId] = useState<string>((data?.tentativeProjectId as string) || "")
  const [secondaryIds, setSecondaryIds] = useState<string[]>((data?.secondaryProjectIds as string[]) || [])
  const [error, setError] = useState("")

  useEffect(() => {
    if (data?.tentativeProjectId) setPrimaryId(data.tentativeProjectId as string)
    if (Array.isArray(data?.secondaryProjectIds)) setSecondaryIds(data.secondaryProjectIds as string[])
  }, [data])

  useEffect(() => {
    fetch("/api/apply/projects")
      .then((r) => r.json())
      .then((list) => {
        if (Array.isArray(list)) setProjects(list)
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  const toggleSecondary = (id: string) => {
    setError("")
    setSecondaryIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id)
      if (prev.length >= 2) return prev
      return [...prev, id]
    })
  }

  const selectPrimary = (id: string) => {
    setError("")
    setPrimaryId(id)
    setSecondaryIds((prev) => prev.filter((p) => p !== id))
  }

  const handleSubmit = () => {
    if (isRndPathway) {
      if (!primaryId) {
        setError("Please select one tentative TBP project")
        return
      }
    } else {
      if (!primaryId) {
        setError("Please select one primary project")
        return
      }
      if (secondaryIds.length < 2) {
        setError("Please select two secondary projects")
        return
      }
    }

    const primary = projects.find((p) => p.id === primaryId)
    onNext({
      tentativeProjectId: primaryId,
      secondaryProjectIds: isRndPathway ? [] : secondaryIds,
      tentativeProject: primary?.title || "",
    })
  }

  const renderProjectCard = (project: ProjectOption, selected: boolean, onSelect: () => void) => (
    <button
      key={project.id}
      type="button"
      onClick={onSelect}
      className={cn(
        "relative flex w-full flex-col rounded-xl border-2 p-4 text-left transition-all",
        selected ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"
      )}
    >
      {selected && (
        <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
          <Check size={14} />
        </div>
      )}
      {project.category && (
        <span className="mb-2 inline-block w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
          {project.category}
        </span>
      )}
      <h3 className="pr-8 text-sm font-bold text-gray-900">{project.title}</h3>
      {project.description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">{project.description}</p>
      )}
    </button>
  )

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-gray-900">Tentative TBP Project</h2>
      <p className="mt-1 text-sm text-gray-500">Section 6 of the Application / Programme Terms Form</p>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/60 p-4">
        <Info size={16} className="mt-0.5 shrink-0 text-blue-600" />
        <p className="text-xs leading-relaxed text-blue-900">
          Select a tentative TBP project below. Your selection can be changed after your admission is approved &mdash;
          approval is typically confirmed within 24 hours of successful payment.
        </p>
      </div>

      {loading ? (
        <div className="mt-8 flex items-center justify-center rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <Loader2 size={20} className="animate-spin text-gray-400" />
          <p className="ml-2 text-sm text-gray-500">Loading TBP projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-200 py-12 text-center">
          <p className="text-sm text-gray-500">No TBP projects are currently available. Please try again later.</p>
        </div>
      ) : isRndPathway ? (
        <>
          <div className="mt-8">
            <Label>Tentative Project *</Label>
            <p className="mt-1 text-xs text-gray-500">
              Applied R&amp;D &amp; Technology Development &mdash; select one TBP R&amp;D project you would like to work on.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {projects.map((project) =>
                renderProjectCard(project, primaryId === project.id, () => selectPrimary(project.id))
              )}
            </div>
          </div>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </>
      ) : (
        <>
          <div className="mt-8">
            <Label>Primary Project *</Label>
            <p className="mt-1 text-xs text-gray-500">
              TBP Global Strategist Fellowship &mdash; select one primary project you would like to focus on.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {projects.map((project) =>
                renderProjectCard(project, primaryId === project.id, () => selectPrimary(project.id))
              )}
            </div>
          </div>

          <div className="mt-8">
            <Label>Secondary Projects *</Label>
            <p className="mt-1 text-xs text-gray-500">
              Select two supporting projects (different from your primary project) that you would like to contribute to.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {projects.map((project) =>
                renderProjectCard(
                  project,
                  secondaryIds.includes(project.id),
                  () => toggleSecondary(project.id)
                )
              )}
            </div>
            <p className="mt-2 text-xs text-gray-400">
              {secondaryIds.length}/2 secondary projects selected
            </p>
          </div>

          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </>
      )}

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} className="rounded-full px-6">
          <ChevronLeft size={16} className="mr-1" /> Back
        </Button>
        <Button onClick={handleSubmit} disabled={loading} className="rounded-full px-8">
          Continue <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  )
}
