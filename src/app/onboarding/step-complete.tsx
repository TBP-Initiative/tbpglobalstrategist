"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, CreditCard, Calendar, Hash } from "lucide-react"

interface StepCompleteProps {
  data: Record<string, unknown> | null
}

export function StepComplete({ data }: StepCompleteProps) {
  const pathway = (data?.pathway as string) || "STANDARD"
  const amount = pathway === "PLUS" ? "$1,500" : "$1,200"
  const paymentRef = (data?.paymentReference as string) || null
  const paymentProvider = (data?.paymentProvider as string) || null
  const paidAt = data?.paidAt ? new Date(data.paidAt as string) : new Date()

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

      {/* Payment Receipt */}
      <div className="mx-auto mt-6 max-w-md rounded-xl border border-gray-200 bg-gray-50/50 p-5 text-left">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <CreditCard size={14} className="text-gray-500" />
          Payment Receipt
        </h3>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Programme</span>
            <span className="font-medium text-gray-900">
              {pathway === "PLUS" ? "Fellowship Plus" : "Standard Fellowship"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount Paid</span>
            <span className="font-bold text-gray-900">{amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-medium text-gray-900">
              {paymentProvider === "PAYPAL" ? "PayPal" : paymentProvider === "STRIPE" ? "Card (Stripe)" : paymentProvider === "TEST" ? "Test Mode" : "N/A"}
            </span>
          </div>
          {paymentRef && (
            <div className="flex justify-between">
              <span className="text-gray-500 flex items-center gap-1"><Hash size={11} /> Reference</span>
              <span className="font-mono text-xs text-gray-700 max-w-[180px] truncate">{paymentRef}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500 flex items-center gap-1"><Calendar size={11} /> Date</span>
            <span className="font-medium text-gray-900">{paidAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Paid</span>
          </div>
        </div>
      </div>

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
