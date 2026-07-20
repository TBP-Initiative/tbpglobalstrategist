"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight, Eye, EyeOff } from "lucide-react"

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
  isLoggedIn: boolean
  referralCode?: string
  onNext: (data: Record<string, unknown>) => void
  saving: boolean
}

export function StepDetails({ data, isLoggedIn, referralCode: refParam, onNext, saving }: StepDetailsProps) {
  const savedAreas = (data?.areasOfInterest as string[]) || []
  const [form, setForm] = useState({
    fullName: (data?.fullName as string) || "",
    preferredName: (data?.preferredName as string) || "",
    phoneNumber: (data?.phoneNumber as string) || "",
    city: (data?.city as string) || "",
    country: (data?.country as string) || "",
    linkedinUrl: (data?.linkedinUrl as string) || "",
    currentStatus: (data?.currentStatus as string) || "",
    email: (data?.email as string) || "",
    password: "",
    confirmPassword: "",
    referralCode: refParam || (data?.referralCode as string) || "",
  })
  const [areas, setAreas] = useState<Set<string>>(new Set(savedAreas))
  const [otherArea, setOtherArea] = useState((data?.otherArea as string) || "")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (field: string, value: string) => setForm({ ...form, [field]: value })

  const toggleArea = (area: string) => {
    setAreas((prev) => {
      const next = new Set(prev)
      if (next.has(area)) next.delete(area)
      else next.add(area)
      return next
    })
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}

    if (!isLoggedIn) {
      if (!form.email) errs.email = "Email is required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email address"

      if (!form.password) errs.password = "Password is required"
      else if (form.password.length < 8) errs.password = "Password must be at least 8 characters"
      else if (!/[A-Z]/.test(form.password)) errs.password = "Must contain an uppercase letter"
      else if (!/[a-z]/.test(form.password)) errs.password = "Must contain a lowercase letter"
      else if (!/[0-9]/.test(form.password)) errs.password = "Must contain a number"

      if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password"
      else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match"
    }

    if (!form.fullName) errs.fullName = "Full name is required"
    if (!form.phoneNumber) errs.phoneNumber = "Phone number is required"
    if (!form.city) errs.city = "City is required"
    if (!form.country) errs.country = "Country is required"
    if (!form.currentStatus) errs.currentStatus = "Select your current status"
    if (areas.size === 0) errs.areas = "Select at least one area of interest"

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const selectedAreas = [...areas]
    if (otherArea && areas.has("Other")) {
      selectedAreas[selectedAreas.indexOf("Other")] = `Other: ${otherArea}`
    }
    onNext({ ...form, areasOfInterest: selectedAreas, otherArea })
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-gray-900">Participant Details</h2>
      <p className="mt-1 text-sm text-gray-500">Section 1 of the Agreement / Programme Terms Form</p>

      {/* Account Creation (only if not logged in) */}
      {!isLoggedIn && (
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50/50 p-5">
          <p className="text-sm font-semibold text-blue-900 mb-4">Create Your Account</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Email Address *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                className="mt-1"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
            <div>
              <Label>Password *</Label>
              <div className="relative mt-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>
            <div>
              <Label>Confirm Password *</Label>
              <div className="relative mt-1">
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  placeholder="Re-enter password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>
          <div className="mt-3">
            <Label>Referral Code <span className="text-blue-500">(optional)</span></Label>
            <Input
              value={form.referralCode}
              onChange={(e) => update("referralCode", e.target.value)}
              placeholder="Enter referral code"
              className="mt-1"
            />
          </div>
          <p className="mt-3 text-xs text-blue-600">Your password must be at least 8 characters with an uppercase letter, lowercase letter, and number.</p>
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Full Legal Name *</Label>
          <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Enter your full legal name" className="mt-1" />
          {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
        </div>
        <div>
          <Label>Preferred Name</Label>
          <Input value={form.preferredName} onChange={(e) => update("preferredName", e.target.value)} placeholder="Preferred name" className="mt-1" />
        </div>
        <div>
          <Label>Phone / WhatsApp *</Label>
          <Input value={form.phoneNumber} onChange={(e) => update("phoneNumber", e.target.value)} placeholder="+1 234 567 890" className="mt-1" />
          {errors.phoneNumber && <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>}
        </div>
        <div>
          <Label>City *</Label>
          <Input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="City" className="mt-1" />
          {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
        </div>
        <div>
          <Label>Country *</Label>
          <Input value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="Country" className="mt-1" />
          {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
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
          {errors.currentStatus && <p className="mt-1 text-xs text-red-600">{errors.currentStatus}</p>}
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
          {errors.areas && <p className="mt-1 text-xs text-red-600">{errors.areas}</p>}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="rounded-full px-8"
        >
          {saving ? "Creating Account..." : "Continue"} <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  )
}
