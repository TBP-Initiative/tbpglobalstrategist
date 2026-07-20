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

interface StepDetailsProps {
  data: Record<string, unknown> | null
  onNext: (data: Record<string, unknown>) => void
  saving: boolean
}

export function StepDetails({ data, onNext, saving }: StepDetailsProps) {
  const [form, setForm] = useState({
    fullName: (data?.fullName as string) || "",
    preferredName: (data?.preferredName as string) || "",
    phoneNumber: (data?.phoneNumber as string) || "",
    city: (data?.city as string) || "",
    country: (data?.country as string) || "",
    linkedinUrl: (data?.linkedinUrl as string) || "",
    currentStatus: (data?.currentStatus as string) || "",
  })

  const update = (field: string, value: string) => setForm({ ...form, [field]: value })

  const isValid = form.fullName && form.phoneNumber && form.city && form.country && form.currentStatus

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
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={() => onNext(form)} disabled={!isValid || saving} className="rounded-full px-8">
          Continue <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  )
}
