"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, CreditCard, Calendar, Hash } from "lucide-react"

interface StepCompleteProps {
  data: Record<string, unknown> | null
}

export function StepComplete({ data }: StepCompleteProps) {
  const pathway = (data?.pathway as string) || "STANDARD"
  const amount = pathway === "PLUS" ? "$7,500" : "$1,500"
  const paymentRef = (data?.paymentReference as string) || null
  const paymentProvider = (data?.paymentProvider as string) || null
  const paidAt = data?.paidAt ? new Date(data.paidAt as string) : new Date()

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle size={32} className="text-green-600" />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-gray-900">
        Application Submitted!
      </h2>

      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-600">
        Your application to the <strong>TBP Global Strategist Institute</strong> has been received and your payment confirmed. Your account is now active as a <strong>TBP Global Strategist Fellow</strong>, and your application will proceed to the Institute review stage.
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
              {pathway === "PLUS" ? "Applied R&D & Technology Development" : "TBP Global Strategist Fellowship"}
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
            <span>TBP Application Review &amp; acceptance confirmation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-green-600">✓</span>
            <span>Portal account activation and Self-Onboarding Pack access</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-green-600">✓</span>
            <span>Complete your professional profile and confirm your pathway</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-green-600">✓</span>
            <span>Confirm your primary TBP project and begin the TBP Foundation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-green-600">✓</span>
            <span>Apply DESQUELET&reg; and develop your thesis / project contribution</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-green-600">✓</span>
            <span>Verified Portfolio &amp; Certification on completion</span>
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
        TBP Global Strategist Institute &mdash; Application Reference: {data?.id ? String(data.id).slice(0, 12) : "N/A"}
      </p>
    </div>
  )
}
