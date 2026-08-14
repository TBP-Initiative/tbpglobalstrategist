"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight, ChevronLeft } from "lucide-react"

const QUALIFICATION_OPTIONS = [
  "Secondary School / O-Level",
  "Diploma / A-Level / Foundation",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate (PhD / DBA)",
  "Professional Certification",
  "Other",
]

interface StepProfessionalBackgroundProps {
  data: Record<string, unknown> | null
  onNext: (data: Record<string, unknown>) => void
  onBack: () => void
}

export function StepProfessionalBackground({ data, onNext, onBack }: StepProfessionalBackgroundProps) {
  const [form, setForm] = useState({
    highestQualification: (data?.highestQualification as string) || "",
    institution: (data?.institution as string) || "",
    fieldOfStudy: (data?.fieldOfStudy as string) || "",
    yearsOfExperience: (data?.yearsOfExperience ? String(data.yearsOfExperience) : "") || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!data) return
    setForm((prev) => ({
      ...prev,
      highestQualification: (data.highestQualification as string) || prev.highestQualification,
      institution: (data.institution as string) || prev.institution,
      fieldOfStudy: (data.fieldOfStudy as string) || prev.fieldOfStudy,
      yearsOfExperience: data.yearsOfExperience ? String(data.yearsOfExperience) : prev.yearsOfExperience,
    }))
  }, [data])

  const update = (field: string, value: string) => setForm({ ...form, [field]: value })

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!form.highestQualification) errs.highestQualification = "Select your highest qualification"
    if (!form.institution) errs.institution = "Institution is required"
    if (!form.fieldOfStudy) errs.fieldOfStudy = "Field of study is required"
    if (!form.yearsOfExperience) errs.yearsOfExperience = "Years of experience is required"
    else if (isNaN(Number(form.yearsOfExperience)) || Number(form.yearsOfExperience) < 0) {
      errs.yearsOfExperience = "Enter a valid number of years"
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-gray-900">Professional Background</h2>
      <p className="mt-1 text-sm text-gray-500">Section 3 of the Application / Programme Terms Form</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Highest Qualification *</Label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {QUALIFICATION_OPTIONS.map((qualification) => (
              <button
                key={qualification}
                type="button"
                onClick={() => update("highestQualification", qualification)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  form.highestQualification === qualification
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                }`}
              >
                {qualification}
              </button>
            ))}
          </div>
          {errors.highestQualification && <p className="mt-1 text-xs text-red-600">{errors.highestQualification}</p>}
        </div>
        <div>
          <Label>Institution / University *</Label>
          <Input
            value={form.institution}
            onChange={(e) => update("institution", e.target.value)}
            placeholder="Name of institution"
            className="mt-1"
          />
          {errors.institution && <p className="mt-1 text-xs text-red-600">{errors.institution}</p>}
        </div>
        <div>
          <Label>Field of Study / Discipline *</Label>
          <Input
            value={form.fieldOfStudy}
            onChange={(e) => update("fieldOfStudy", e.target.value)}
            placeholder="e.g. Economics, Engineering, Architecture"
            className="mt-1"
          />
          {errors.fieldOfStudy && <p className="mt-1 text-xs text-red-600">{errors.fieldOfStudy}</p>}
        </div>
        <div>
          <Label>Years of Professional Experience *</Label>
          <Input
            type="number"
            min={0}
            max={60}
            value={form.yearsOfExperience}
            onChange={(e) => update("yearsOfExperience", e.target.value)}
            placeholder="e.g. 3"
            className="mt-1"
          />
          {errors.yearsOfExperience && <p className="mt-1 text-xs text-red-600">{errors.yearsOfExperience}</p>}
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
