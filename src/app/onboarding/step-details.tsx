"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight } from "lucide-react"

const STATUS_OPTIONS = [
  "Student",
  "Graduate",
  "Young Professional",
  "Researcher",
  "Early-Career Specialist",
  "Entrepreneur",
  "Sector Specialist",
  "Other",
]

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

interface StepDetailsProps {
  data: Record<string, unknown> | null
  onNext: (data: Record<string, unknown>) => void
  saving: boolean
}

export function StepDetails({ data, onNext, saving }: StepDetailsProps) {
  const savedAreas = (data?.areasOfInterest as string[]) || []
  const [form, setForm] = useState({
    fullName: (data?.fullName as string) || "",
    preferredName: (data?.preferredName as string) || "",
    phoneNumber: (data?.phoneNumber as string) || "",
    city: (data?.city as string) || "",
    country: (data?.country as string) || "",
    linkedinUrl: (data?.linkedinUrl as string) || "",
    currentStatus: (data?.currentStatus as string) || "",
  })
  const [areas, setAreas] = useState<Set<string>>(new Set(savedAreas))
  const [otherArea, setOtherArea] = useState((data?.otherArea as string) || "")

  const update = (field: string, value: string) => setForm({ ...form, [field]: value })

  const toggleArea = (area: string) => {
    setAreas((prev) => {
      const next = new Set(prev)
      if (next.has(area)) next.delete(area)
      else next.add(area)
      return next
    })
  }

  const isValid = form.fullName && form.phoneNumber && form.city && form.country && form.currentStatus && areas.size > 0

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-gray-900">Participant Details</h2>
      <p className="mt-1 text-sm text-gray-500">Section 1 of the Agreement / Programme Terms Form</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Full Legal Name *</Label>
          <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Enter your full legal name" className="mt-1" />
        </div>
        <div>
          <Label>Preferred Name</Label>
          <Input value={form.preferredName} onChange={(e) => update("preferredName", e.target.value)} placeholder="Preferred name" className="mt-1" />
        </div>
        <div>
          <Label>Phone / WhatsApp *</Label>
          <Input value={form.phoneNumber} onChange={(e) => update("phoneNumber", e.target.value)} placeholder="+1 234 567 890" className="mt-1" />
        </div>
        <div>
          <Label>City *</Label>
          <Input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="City" className="mt-1" />
        </div>
        <div>
          <Label>Country *</Label>
          <Input value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="Country" className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label>LinkedIn Profile</Label>
          <Input value={form.linkedinUrl} onChange={(e) => update("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/in/yourprofile" className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label>Current Status *</Label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => update("currentStatus", status)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  form.currentStatus === status
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Areas of Interest */}
        <div className="sm:col-span-2">
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
            {/* Other */}
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
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={() => {
            const selectedAreas = [...areas]
            if (otherArea && areas.has("Other")) {
              selectedAreas[selectedAreas.indexOf("Other")] = `Other: ${otherArea}`
            }
            onNext({ ...form, areasOfInterest: selectedAreas, otherArea })
          }}
          disabled={!isValid || saving}
          className="rounded-full px-8"
        >
          Continue <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  )
}
