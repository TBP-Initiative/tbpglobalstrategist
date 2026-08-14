"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ChevronRight, ChevronLeft } from "lucide-react"

interface StepObjectivesProps {
  data: Record<string, unknown> | null
  onNext: (data: Record<string, unknown>) => void
  onBack: () => void
}

export function StepObjectives({ data, onNext, onBack }: StepObjectivesProps) {
  const [objectives, setObjectives] = useState((data?.fellowshipObjectives as string) || "")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!data) return
    if (data.fellowshipObjectives) setObjectives(data.fellowshipObjectives as string)
  }, [data])

  const handleSubmit = () => {
    if (!objectives.trim()) {
      setError("Please state your fellowship objectives")
      return
    }
    if (objectives.trim().length < 30) {
      setError("Please provide at least 30 characters describing your objectives")
      return
    }
    onNext({ fellowshipObjectives: objectives.trim() })
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-gray-900">Fellowship Objectives</h2>
      <p className="mt-1 text-sm text-gray-500">Section 7 of the Application / Programme Terms Form</p>

      <div className="mt-8">
        <Label>Statement of Purpose *</Label>
        <p className="mt-1 text-xs text-gray-500">
          Briefly explain what you hope to achieve through the TBP Global Strategist Institute Fellowship &mdash; your learning goals, the skills you want to develop, and the contribution you intend to make.
        </p>
        <textarea
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
          rows={6}
          placeholder="Describe your fellowship objectives..."
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
