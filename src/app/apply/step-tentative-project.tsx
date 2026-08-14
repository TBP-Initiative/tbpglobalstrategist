"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ChevronRight, ChevronLeft } from "lucide-react"

interface StepTentativeProjectProps {
  data: Record<string, unknown> | null
  onNext: (data: Record<string, unknown>) => void
  onBack: () => void
}

export function StepTentativeProject({ data, onNext, onBack }: StepTentativeProjectProps) {
  const [tentativeProject, setTentativeProject] = useState((data?.tentativeProject as string) || "")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!data) return
    if (data.tentativeProject) setTentativeProject(data.tentativeProject as string)
  }, [data])

  const handleSubmit = () => {
    if (!tentativeProject.trim()) {
      setError("Please describe your tentative TBP project")
      return
    }
    if (tentativeProject.trim().length < 20) {
      setError("Please provide at least 20 characters describing your tentative project")
      return
    }
    onNext({ tentativeProject: tentativeProject.trim() })
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-gray-900">Tentative TBP Project</h2>
      <p className="mt-1 text-sm text-gray-500">Section 6 of the Application / Programme Terms Form</p>

      <div className="mt-8">
        <Label>Tentative Project *</Label>
        <p className="mt-1 text-xs text-gray-500">
          Describe the project you would like to contribute to within the TBP ecosystem &mdash; for example a research study, feasibility assessment, sector strategy, infrastructure concept, digital platform or policy analysis aligned to your field of interest.
        </p>
        <textarea
          value={tentativeProject}
          onChange={(e) => setTentativeProject(e.target.value)}
          rows={6}
          placeholder="Describe your tentative TBP project here..."
          className="mt-3 w-full rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} className="rounded-full px-6">
          <ChevronLeft size={16} className="mr-1" /> Back
        </Button>
        <Button onClick={handleSubmit} className="rounded-full px-8">
          Continue <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  )
}
