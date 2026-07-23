"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Shield, Loader2, AlertCircle } from "lucide-react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"

interface StepPaymentProps {
  data: Record<string, unknown> | null
  pathway?: string
  onNext: (data: Record<string, unknown>) => void
  onBack: () => void
}

export function StepPayment({ data, pathway: pathwayProp, onNext, onBack }: StepPaymentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null)
  const [paypalError, setPaypalError] = useState<string | null>(null)
  const [cancelled, setCancelled] = useState(false)
  const pathway = pathwayProp || (data?.pathway as string) || "STANDARD"
  const amount = pathway === "PLUS" ? "$1,500" : "$1,200"
  const isTestMode = process.env.NODE_ENV !== "production"

  useEffect(() => {
    if (searchParams.get("cancelled") === "true") {
      setCancelled(true)
      router.replace("/onboarding?step=6")
    }
  }, [searchParams, router])

  useEffect(() => {
    fetch("/api/onboarding/payment")
      .then((r) => r.json())
      .then((d) => { if (d.paypalClientId) setPaypalClientId(d.paypalClientId) })
      .catch(() => {})
  }, [])

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-gray-900">Payment</h2>
      <p className="mt-1 text-sm text-gray-500">Section 6 of the Agreement / Programme Terms Form</p>

      {cancelled && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          <AlertCircle size={18} />
          <span>Payment was cancelled. Please try again below.</span>
        </div>
      )}

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

      {paypalClientId ? (
        <div className="mt-6">
          <PayPalScriptProvider
            options={{
              clientId: paypalClientId,
              currency: "USD",
              intent: "capture",
            }}
          >
            <PayPalButtons
              style={{ layout: "vertical", height: 50 }}
              createOrder={async () => {
                setPaypalError(null)
                setLoading(true)
                try {
                  const res = await fetch("/api/onboarding/payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ provider: "PAYPAL", pathway }),
                  })
                  const result = await res.json()
                  if (result.paypalOrderId) {
                    setLoading(false)
                    return result.paypalOrderId
                  }
                  if (result.error) throw new Error(result.error)
                  return ""
                } catch (err) {
                  setPaypalError(err instanceof Error ? err.message : "Failed to initiate payment.")
                  setLoading(false)
                  return ""
                }
              }}
              onApprove={async (details) => {
                setLoading(true)
                try {
                  const captureRes = await fetch("/api/onboarding/payment/capture", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderId: details.orderID }),
                  })
                  const captureData = await captureRes.json()
                  if (captureData.error) {
                    setPaypalError(captureData.error)
                    setLoading(false)
                    return
                  }
                  await fetch("/api/onboarding", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ step: 7, paymentReference: details.orderID, paymentAmount: amount, paymentProvider: "PAYPAL" }),
                  })
                  onNext({ paymentReference: details.orderID, paymentAmount: amount, paymentProvider: "PAYPAL" })
                } catch {
                  setPaypalError("Payment capture failed. Please try again.")
                  setLoading(false)
                }
              }}
              onError={(err) => {
                console.error("PayPal error:", err)
                setPaypalError("PayPal encountered an error. Please try again.")
                setLoading(false)
              }}
            />
          </PayPalScriptProvider>
          {paypalError && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {paypalError}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          PayPal is loading. Please wait...
        </div>
      )}

      {loading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Loader2 size={16} className="animate-spin" />
          <span>Processing payment...</span>
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-xs text-green-700">
        <Shield size={14} />
        <span>Your payment is secured with 256-bit SSL encryption via PayPal</span>
      </div>

      {isTestMode && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-700 mb-2">Test Mode</p>
          <p className="text-xs text-amber-600 mb-3">Skip payment to test the onboarding flow without real charges.</p>
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={async () => {
              setLoading(true)
              try {
                const res = await fetch("/api/onboarding/payment/capture", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderId: "TEST-MOCK-" + Date.now(), testMode: true }),
                })
                const d = await res.json()
                if (d.error) {
                  setPaypalError(d.error)
                  setLoading(false)
                  return
                }
                await fetch("/api/onboarding", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ step: 7, paymentReference: "TEST-MOCK-" + Date.now(), paymentAmount: amount, paymentProvider: "TEST" }),
                })
                onNext({ paymentReference: "TEST-MOCK-" + Date.now(), paymentAmount: amount, paymentProvider: "TEST" })
              } catch {
                setPaypalError("Test payment failed.")
                setLoading(false)
              }
            }}
          >
            {loading ? "Processing..." : "Skip Payment (Test Mode)"}
          </Button>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} className="rounded-full px-6">
          <ChevronLeft size={16} className="mr-1" /> Back
        </Button>
        <div />
      </div>
    </div>
  )
}
