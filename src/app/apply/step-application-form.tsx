"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight, Eye, EyeOff } from "lucide-react"

interface StepApplicationFormProps {
  data: Record<string, unknown> | null
  isLoggedIn: boolean
  referralCode?: string
  onNext: (data: Record<string, unknown>) => void
  saving: boolean
}

export function StepApplicationForm({ data, isLoggedIn, referralCode: refParam, onNext, saving }: StepApplicationFormProps) {
  const [form, setForm] = useState({
    fullName: (data?.fullName as string) || "",
    preferredName: (data?.preferredName as string) || "",
    email: (data?.email as string) || "",
    password: "",
    confirmPassword: "",
    referralCode: refParam || "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")

  useEffect(() => {
    if (!data) return
    setForm((prev) => ({
      ...prev,
      fullName: (data.fullName as string) || prev.fullName,
      preferredName: (data.preferredName as string) || prev.preferredName,
      email: (data.email as string) || prev.email,
      referralCode: refParam || prev.referralCode,
    }))
  }, [data, refParam])

  const update = (field: string, value: string) => setForm({ ...form, [field]: value })

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

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setServerError("")
    try {
      await onNext({ ...form })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ""
      if (msg.includes("already exists")) {
        setErrors({ ...errors, email: msg })
        setServerError("")
      } else if (msg.includes("Password does not match")) {
        setErrors({ ...errors, password: msg })
        setServerError("")
      } else {
        setServerError(msg || "Something went wrong. Please try again.")
      }
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-gray-900">Application Form</h2>
      <p className="mt-1 text-sm text-gray-500">Section 1 of the TBP Global Strategist Institute Application</p>

      {!isLoggedIn ? (
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50/50 p-5">
          <p className="mb-4 text-sm font-semibold text-blue-900">Create Your Institute Account</p>
          {serverError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {serverError}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Full Legal Name *</Label>
              <Input
                value={form.fullName}
                onChange={(e) => { update("fullName", e.target.value); if (errors.fullName) setErrors({ ...errors, fullName: "" }) }}
                placeholder="Enter your full legal name"
                className="mt-1"
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
            </div>
            <div>
              <Label>Preferred Name</Label>
              <Input
                value={form.preferredName}
                onChange={(e) => update("preferredName", e.target.value)}
                placeholder="Preferred name"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Email Address *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => { update("email", e.target.value); if (errors.email) setErrors({ ...errors, email: "" }) }}
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
      ) : (
        <p className="mt-6 rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-sm text-gray-600">
          You are signed in as <strong>{form.email || "a registered applicant"}</strong>. Continue your application below.
        </p>
      )}

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="rounded-full px-8"
        >
          {saving ? "Saving..." : "Continue"} <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  )
}
