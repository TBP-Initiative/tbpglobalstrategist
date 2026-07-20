"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight, ChevronLeft } from "lucide-react"

interface StepAgreementProps {
  data: Record<string, unknown> | null
  pathway?: string
  onNext: (data: Record<string, unknown>) => void
  onBack: () => void
  saving: boolean
}

const ACKNOWLEDGEMENTS = [
  { key: "agreedToTerms", text: "I understand that the TBP Global Strategist Fellowship Programme is an educational and professional-development programme." },
  { key: "agreedToTerms", text: "I understand that Conditional Acceptance does not mean final programme activation." },
  { key: "agreedToTerms", text: "I understand that programme activation is subject to acceptance of these terms, completion of onboarding requirements, payment or an approved payment arrangement, and TBP confirmation." },
  { key: "agreedToNoClaim", text: "I understand that the programme fee is not a payment for employment, visa sponsorship, investment access, project appointment or guaranteed future paid work." },
  { key: "agreedToTerms", text: "I understand that portal access is subject to completion of onboarding, acceptance of programme terms and payment confirmation." },
  { key: "agreedToTerms", text: "I understand that public profile visibility is subject to TBP approval." },
  { key: "agreedToTerms", text: "I understand that Certificate of Completion is subject to successful participation and completion of programme requirements." },
  { key: "agreedToConduct", text: "I understand that I must not represent TBP externally without written approval." },
  { key: "agreedToConduct", text: "I understand that I must not contact investors, project owners, public-sector bodies or strategic partners on behalf of TBP without written approval." },
  { key: "agreedToNoClaim", text: "I understand that I must not make financial, investment, employment, visa, endorsement or guaranteed-outcome claims on behalf of TBP." },
  { key: "agreedToIP", text: "I agree to respect TBP confidentiality, intellectual property and programme conduct expectations." },
  { key: "agreedToAccurate", text: "I confirm that the information I have provided is accurate to the best of my knowledge." },
]

const CHECKBOX_LABELS: Record<string, string> = {
  agreedToTerms: "I have read and agree to all programme terms and conditions",
  agreedToConduct: "I agree to the participant conduct requirements",
  agreedToIP: "I agree to respect TBP intellectual property and confidentiality",
  agreedToPrivacy: "I consent to the processing of my personal data for programme administration",
  agreedToNoClaim: "I understand the programme does not guarantee employment, sponsorship or investment",
  agreedToAccurate: "I confirm that all information provided is accurate",
  agreedToRefund: "I understand the refund and cancellation policy",
}

export function StepAgreement({ data, pathway, onNext, onBack, saving }: StepAgreementProps) {
  const [signature, setSignature] = useState((data?.signatureName as string) || "")
  const [checks, setChecks] = useState<Record<string, boolean>>({
    agreedToTerms: (data?.agreedToTerms as boolean) || false,
    agreedToConduct: (data?.agreedToConduct as boolean) || false,
    agreedToIP: (data?.agreedToIP as boolean) || false,
    agreedToPrivacy: (data?.agreedToPrivacy as boolean) || false,
    agreedToNoClaim: (data?.agreedToNoClaim as boolean) || false,
    agreedToAccurate: (data?.agreedToAccurate as boolean) || false,
    agreedToRefund: (data?.agreedToRefund as boolean) || false,
  })
  const [visibility, setVisibility] = useState((data?.profileVisibility as string) || "PUBLIC")

  const allChecked = Object.values(checks).every(Boolean)
  const isValid = signature.length >= 2 && allChecked

  const toggleCheck = (key: string) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-gray-900">Agreement Confirmation</h2>
      <p className="mt-1 text-sm text-gray-500">Sections 12, 24 &amp; 25 of the Agreement / Programme Terms Form</p>

      {/* Profile Visibility */}
      <div className="mt-6 rounded-xl border border-gray-200 p-5">
        <Label className="text-sm font-semibold">Profile Visibility Preference</Label>
        <p className="mt-1 text-xs text-gray-500">Section 12: Choose whether your profile should be public, private, or approved before going public.</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { value: "PUBLIC", label: "Public" },
            { value: "PRIVATE", label: "Private only" },
            { value: "APPROVAL", label: "Public after approval" },
            { value: "TBD", label: "To be decided" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setVisibility(opt.value)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                visibility === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Acknowledgements */}
      <div className="mt-6 space-y-3">
        <p className="text-sm font-semibold text-gray-900">Participant Acknowledgements (Section 24)</p>
        <p className="text-xs text-gray-500">Below are the key programme statements you must acknowledge. Checking a box confirms you have read and understood that category of terms.</p>
        {ACKNOWLEDGEMENTS.map((ack, i) => (
          <div key={i} className="rounded-lg border border-gray-100 bg-white p-3 text-sm text-gray-600">
            {ack.text}
          </div>
        ))}
      </div>

      {/* Confirmation Checkboxes */}
      <div className="mt-6 space-y-3">
        <p className="text-sm font-semibold text-gray-900">Please confirm each statement:</p>
        {Object.entries(CHECKBOX_LABELS).map(([key, label]) => (
          <label key={key} className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50">
            <input
              type="checkbox"
              checked={checks[key] || false}
              onChange={() => toggleCheck(key)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700">{label}</span>
          </label>
        ))}
      </div>

      {/* Signature */}
      <div className="mt-6 rounded-xl border border-gray-200 p-5">
        <Label className="text-sm font-semibold">Agreement Confirmation (Section 25)</Label>
        <p className="mt-1 text-xs text-gray-500">By typing your name below, you confirm that you have read, understood and accepted the terms of participation.</p>
        <Input
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          placeholder="Type your full legal name as signature"
          className="mt-3"
        />
        <p className="mt-2 text-xs text-gray-400">Selected pathway: {pathway === "PLUS" ? "Fellowship Plus \u2014 US$1,500" : "Standard Fellowship \u2014 US$1,200"}</p>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} className="rounded-full px-6">
          <ChevronLeft size={16} className="mr-1" /> Back
        </Button>
        <Button
          onClick={() => onNext({
            signatureName: signature,
            agreedToTerms: checks.agreedToTerms,
            agreedToConduct: checks.agreedToConduct,
            agreedToIP: checks.agreedToIP,
            agreedToPrivacy: checks.agreedToPrivacy,
            agreedToNoClaim: checks.agreedToNoClaim,
            agreedToAccurate: checks.agreedToAccurate,
            agreedToRefund: checks.agreedToRefund,
            profileVisibility: visibility,
          })}
          disabled={!isValid || saving}
          className="rounded-full px-8"
        >
          Proceed to Payment <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  )
}
