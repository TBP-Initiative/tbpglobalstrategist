"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"

interface StepCompleteProps {
  data: Record<string, unknown> | null
}

export function StepComplete({ data }: StepCompleteProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle size={32} className="text-green-600" />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-gray-900">
        Welcome to TBP Global Strategist Fellowship!
      </h2>

      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-600">
        Your payment has been confirmed and your account has been activated. You are now a <strong>TBP Global Strategist Fellow</strong> at Stage 2 of the progression pathway.
      </p>

      <div className="mx-auto mt-6 max-w-md rounded-xl border border-green-200 bg-green-50/50 p-5 text-left">
        <h3 className="text-sm font-bold text-gray-900">What happens next:</h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-green-600">✓</span>
            <span>Your profile is now visible on the TBP network</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-green-600">✓</span>
            <span>You have access to the Self-Onboarding Pack</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-green-600">✓</span>
            <span>You can browse and join TBP projects</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-green-600">✓</span>
            <span>Assignments and contribution tracking is active</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-green-600">✓</span>
            <span>Your pathway to Certificate of Completion has begun</span>
          </li>
        </ul>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link href="/dashboard">
          <Button className="rounded-full px-8">
            Go to Dashboard <ArrowRight size={16} className="ml-1" />
          </Button>
        </Link>
        <Link href="/dashboard/profile">
          <Button variant="outline" className="rounded-full px-8">
            Complete Profile
          </Button>
        </Link>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        TBP Global Strategist Fellowship &mdash; Programme Reference: {data?.id ? String(data.id).slice(0, 12) : "N/A"}
      </p>
    </div>
  )
}
