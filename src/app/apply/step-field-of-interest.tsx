"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ChevronRight, ChevronLeft } from "lucide-react"

const AREAS_OF_INTEREST = [
  "Architecture, Urbanism & Built Environment, Smart City",
  "Engineering & Technical Infrastructure",
  "Capital Advisory, Investment & Finance",
  "Trade, Logistics & Supply Chains",
  "Maritime & Offshore Infrastructure",
  "Energy, Natural Resources & Industrial Systems",
  "ESG, Sustainability & Climate Resilience",
  "Law, Regulation & Compliance",
  "Public Policy, Government & Institutional Relations",
  "Technology, Software & Digital Infrastructure",
  "Artificial Intelligence, Data & Automation",
  "Marketing, Communications & Strategic Media",
  "Business Strategy & Management",
  "Economics, Research & Market Intelligence",
  "Security, Risk & Resilience",
  "Education, Talent & Professional Development",
  "Social Impact, Culture & Community Development",
]

interface StepFieldOfInterestProps {
  data: Record<string, unknown> | null
  onNext: (data: Record<string, unknown>) => void
  onBack: () => void
}

export function StepFieldOfInterest({ data, onNext, onBack }: StepFieldOfInterestProps) {
  const savedAreas = (data?.areasOfInterest as string[]) || []
  const [areas, setAreas] = useState<Set<string>>(new Set(savedAreas))
  const [otherArea, setOtherArea] = useState((data?.otherArea as string) || "")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!data) return
    if (data.areasOfInterest) setAreas(new Set(data.areasOfInterest as string[]))
    if (data.otherArea) setOtherArea(data.otherArea as string)
  }, [data])

  const toggleArea = (area: string) => {
    setAreas((prev) => {
      const next = new Set(prev)
      if (next.has(area)) next.delete(area)
      else next.add(area)
      return next
    })
  }

  const handleSubmit = () => {
    if (areas.size === 0) {
      setError("Select at least one field of interest")
      return
    }
    const selectedAreas = [...areas]
    if (otherArea && areas.has("Other")) {
      selectedAreas[selectedAreas.indexOf("Other")] = `Other: ${otherArea}`
    }
    onNext({ areasOfInterest: selectedAreas, otherArea })
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-gray-900">Field of Interest</h2>
      <p className="mt-1 text-sm text-gray-500">Section 4 of the Application / Programme Terms Form</p>

      <div className="mt-8">
        <Label>Area(s) of Interest * <span className="text-xs font-normal text-gray-400">(select at least one)</span></Label>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {AREAS_OF_INTEREST.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => toggleArea(area)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                areas.has(area)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
              }`}
            >
              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                areas.has(area) ? "border-primary bg-primary text-white" : "border-gray-300 bg-white"
              }`}>
                {areas.has(area) && <span className="text-[10px]">✓</span>}
              </span>
              {area}
            </button>
          ))}
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <button
              type="button"
              onClick={() => toggleArea("Other")}
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                areas.has("Other") ? "border-primary bg-primary text-white" : "border-gray-300 bg-white"
              }`}
            >
              {areas.has("Other") && <span className="text-[10px]">✓</span>}
            </button>
            <span className="text-xs font-medium text-gray-600">Other:</span>
            <input
              value={otherArea}
              onChange={(e) => { setOtherArea(e.target.value); if (e.target.value) toggleArea("Other") }}
              placeholder="Insert details"
              className="w-full bg-transparent text-xs outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
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
