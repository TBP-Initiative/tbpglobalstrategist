"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight, ChevronLeft } from "lucide-react"

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

interface StepPersonalDetailsProps {
  data: Record<string, unknown> | null
  onNext: (data: Record<string, unknown>) => void
  onBack: () => void
}

export function StepPersonalDetails({ data, onNext, onBack }: StepPersonalDetailsProps) {
  const [form, setForm] = useState({
    dateOfBirth: (data?.dateOfBirth as string) || "",
    nationality: (data?.nationality as string) || "",
    phoneNumber: (data?.phoneNumber as string) || "",
    city: (data?.city as string) || "",
    country: (data?.country as string) || "",
    linkedinUrl: (data?.linkedinUrl as string) || "",
    currentStatus: (data?.currentStatus as string) || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!data) return
    setForm((prev) => ({
      ...prev,
      dateOfBirth: (data.dateOfBirth as string) || prev.dateOfBirth,
      nationality: (data.nationality as string) || prev.nationality,
      phoneNumber: (data.phoneNumber as string) || prev.phoneNumber,
      city: (data.city as string) || prev.city,
      country: (data.country as string) || prev.country,
      linkedinUrl: (data.linkedinUrl as string) || prev.linkedinUrl,
      currentStatus: (data.currentStatus as string) || prev.currentStatus,
    }))
  }, [data])

  const update = (field: string, value: string) => setForm({ ...form, [field]: value })

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!form.dateOfBirth) errs.dateOfBirth = "Date of birth is required"
    if (!form.nationality) errs.nationality = "Nationality is required"
    if (!form.phoneNumber) errs.phoneNumber = "Phone number is required"
    if (!form.city) errs.city = "City is required"
    if (!form.country) errs.country = "Country is required"
    if (!form.currentStatus) errs.currentStatus = "Select your current status"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-gray-900">Personal Details</h2>
      <p className="mt-1 text-sm text-gray-500">Section 2 of the Application / Programme Terms Form</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <Label>Date of Birth *</Label>
          <Input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => update("dateOfBirth", e.target.value)}
            className="mt-1"
          />
          {errors.dateOfBirth && <p className="mt-1 text-xs text-red-600">{errors.dateOfBirth}</p>}
        </div>
        <div>
          <Label>Nationality *</Label>
          <Input
            value={form.nationality}
            onChange={(e) => update("nationality", e.target.value)}
            placeholder="e.g. Nigerian, British, German"
            className="mt-1"
          />
          {errors.nationality && <p className="mt-1 text-xs text-red-600">{errors.nationality}</p>}
        </div>
        <div>
          <Label>Phone / WhatsApp *</Label>
          <Input
            value={form.phoneNumber}
            onChange={(e) => update("phoneNumber", e.target.value)}
            placeholder="+1 234 567 890"
            className="mt-1"
          />
          {errors.phoneNumber && <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>}
        </div>
        <div>
          <Label>City *</Label>
          <Input
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="City"
            className="mt-1"
          />
          {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
        </div>
        <div>
          <Label>Country *</Label>
          <Input
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            placeholder="Country"
            className="mt-1"
          />
          {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
        </div>
        <div>
          <Label>LinkedIn Profile</Label>
          <Input
            value={form.linkedinUrl}
            onChange={(e) => update("linkedinUrl", e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
            className="mt-1"
          />
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
          {errors.currentStatus && <p className="mt-1 text-xs text-red-600">{errors.currentStatus}</p>}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} className="rounded-full px-6">
          <ChevronLeft size={16} className="mr-1" /> Back
        </Button>
        <Button onClick={() => onNext(form)} className="rounded-full px-8">
          Continue <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  )
}
