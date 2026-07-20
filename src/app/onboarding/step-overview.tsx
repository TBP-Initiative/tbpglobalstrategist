"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from "lucide-react"

interface StepOverviewProps {
  data: Record<string, unknown> | null
  onNext: () => void
  onBack: () => void
}

export function StepOverview({ onNext, onBack }: StepOverviewProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-gray-900">Programme Flow Acknowledgement</h2>
      <p className="mt-1 text-sm text-gray-500">Section 2 of the Agreement / Programme Terms Form</p>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-gray-700">
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
          <p className="font-semibold text-gray-900">Programme Flow:</p>
          <p className="mt-2 text-gray-600">
            Apply / Register &rarr; Review &rarr; Conditional Acceptance &rarr; Onboarding &amp; Pathway Alignment Session &rarr; Agreement / Programme Terms &rarr; Payment &rarr; Portal Access &rarr; Self-Onboarding Pack &rarr; Assignments and Contribution Tracking
          </p>
        </div>

        <p>
          The participant understands that the TBP Global Strategist Fellowship Programme is an educational and professional-development programme developed by The Borderless Project.
        </p>

        <p>
          The programme is designed for students, graduates, young professionals, researchers, early-career specialists and selected sector participants who wish to learn the TBP system, apply the DESQUELET&reg; methodology, build a professional portfolio, gain applied project exposure and develop a verified record of contribution within the TBP ecosystem.
        </p>

        <div>
          <p className="font-semibold text-gray-900 mb-2">The programme may include:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Structured TBP learning pathway</li>
            <li>Access to the TBP Global Strategist Portal</li>
            <li>Sector pathway alignment</li>
            <li>Applied project assignments</li>
            <li>Portfolio development support</li>
            <li>Assignment submission and review</li>
            <li>Contribution records</li>
            <li>Public or private TBP profile creation</li>
            <li>Feedback and progression review</li>
            <li>Certificate of Completion, subject to successful participation</li>
            <li>Verified contribution record, where approved work is completed</li>
          </ul>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-5">
          <p className="font-semibold text-amber-800">Important:</p>
          <p className="mt-1 text-amber-700">
            The programme is educational, developmental and portfolio-focused. It is not employment, internship employment, visa sponsorship, investment access, project appointment, guaranteed paid work or a regulated advisory appointment.
          </p>
        </div>

        <p>
          The participant understands that programme participation is only activated after TBP confirms acceptance of the Agreement / Programme Terms and payment or an approved payment arrangement.
        </p>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} className="rounded-full px-6">
          <ChevronLeft size={16} className="mr-1" /> Back
        </Button>
        <Button onClick={onNext} className="rounded-full px-8">
          I understand <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  )
}
