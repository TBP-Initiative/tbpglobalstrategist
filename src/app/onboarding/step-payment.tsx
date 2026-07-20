"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, CreditCard, Shield, Loader2 } from "lucide-react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"

interface StepPaymentProps {
  data: Record<string, unknown> | null
  onNext: (data: Record<string, unknown>) => void
  onBack: () => void
}

export function StepPayment({ data, onNext, onBack }: StepPaymentProps) {
  const [provider, setProvider] = useState<"STRIPE" | "PAYPAL" | "">("")
  const [loading, setLoading] = useState(false)
  const pathway = (data?.pathway as string) || "STANDARD"
  const amount = pathway === "PLUS" ? "$1,500" : "$1,200"
  const amountNum = pathway === "PLUS" ? 1500 : 1200

  const handleStripe = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/onboarding/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "STRIPE", pathway }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-gray-900">Payment</h2>
      <p className="mt-1 text-sm text-gray-500">Section 6 of the Agreement / Programme Terms Form</p>

      <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {pathway === "PLUS" ? "Fellowship Plus" : "Standard Fellowship"}
            </p>
            <p className="text-xs text-gray-500">Programme Fee</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{amount}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-sm font-semibold text-gray-900">Select Payment Method</p>

        <button
          type="button"
          onClick={() => setProvider("STRIPE")}
          className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
            provider === "STRIPE" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
            <CreditCard size={20} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Pay with Card (Stripe)</p>
            <p className="text-xs text-gray-500">Visa, Mastercard, Apple Pay, Google Pay</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setProvider("PAYPAL")}
          className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
            provider === "PAYPAL" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400 text-blue-900 font-bold text-sm">
            PP
          </div>
          <div>
            <p className="font-semibold text-gray-900">Pay with PayPal</p>
            <p className="text-xs text-gray-500">PayPal account or card via PayPal</p>
          </div>
        </button>
      </div>

      {provider === "STRIPE" && (
        <div className="mt-6">
          <Button onClick={handleStripe} disabled={loading} className="w-full rounded-xl py-6 text-base">
            {loading ? (
              <><Loader2 size={18} className="mr-2 animate-spin" /> Redirecting to Stripe...</>
            ) : (
              <>Pay {amount} with Card</>
            )}
          </Button>
        </div>
      )}

      {provider === "PAYPAL" && process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && (
        <div className="mt-6">
          <PayPalScriptProvider
            options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
              currency: "USD",
              intent: "capture",
            }}
          >
            <PayPalButtons
              style={{ layout: "vertical", height: 50 }}
              createOrder={async () => {
                const res = await fetch("/api/onboarding/payment", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ provider: "PAYPAL", pathway }),
                })
                const result = await res.json()
                if (result.paypalOrderId) return result.paypalOrderId
                if (result.error) throw new Error(result.error)
                return ""
              }}
              onApprove={async (details) => {
                setLoading(true)
                try {
                  await fetch("/api/onboarding", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ step: 7, paymentReference: details.orderID }),
                  })
                  onNext({})
                } finally {
                  setLoading(false)
                }
              }}
              onError={() => {
                setLoading(false)
              }}
            />
          </PayPalScriptProvider>
        </div>
      )}

      {provider === "PAYPAL" && !process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          PayPal is not yet configured. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID in your environment.
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-xs text-green-700">
        <Shield size={14} />
        <span>Your payment is secured with 256-bit SSL encryption</span>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} className="rounded-full px-6">
          <ChevronLeft size={16} className="mr-1" /> Back
        </Button>
        <div />
      </div>
    </div>
  )
}
