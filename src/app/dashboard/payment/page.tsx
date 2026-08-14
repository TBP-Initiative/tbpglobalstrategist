"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Loader2, CheckCircle2, Star, Zap } from "lucide-react"

const PLANS = {
  STANDARD: {
    amount: 1500,
    display: "$1,500",
    name: "TBP Global Strategist Fellowship",
    description: "The essential pathway to becoming a TBP Global Strategist Fellow.",
    features: [
      "Guided DESQUELET\u00AE learning pathway",
      "TBP Global Strategist Portal access",
      "Primary Project + up to 2 Supporting Projects",
      "Public profile and portfolio development",
      "Feedback and progress review",
      "Certificate of Completion",
      "Verified Project Experience Record",
    ],
  },
  PLUS: {
    amount: 7500,
    display: "$7,500",
    name: "Applied R&D & Technology Development",
    description: "An applied research and technology development pathway.",
    features: [
      "Core Fellowship learning + DESQUELET\u00AE",
      "One approved TBP R&D project",
      "Research / engineering / software development",
      "Modelling, simulation or prototyping where relevant",
      "Structured technical reviews",
      "Applied R&D Project Record",
      "Professional evidence portfolio",
    ],
  },
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => { render: (el: HTMLElement) => void; close: () => void }
    }
  }
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedPlan, setSelectedPlan] = useState<"STANDARD" | "PLUS" | null>(null)
  const [loading, setLoading] = useState(false)
  const [paypalError, setPaypalError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [sdkReady, setSdkReady] = useState(false)
  const paypalRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<{ close: () => void } | null>(null)
  const isTestMode = process.env.NODE_ENV !== "production"

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setPaymentSuccess(true)
    }
  }, [searchParams])

  useEffect(() => {
    fetch("/api/payment")
      .then((r) => r.json())
      .then((d) => {
        if (d.paypalClientId) {
          if (window.paypal) {
            setSdkReady(true)
            return
          }
          const script = document.createElement("script")
          script.src = `https://www.paypal.com/sdk/js?client-id=${d.paypalClientId}&currency=USD&intent=capture`
          script.async = true
          script.onload = () => setSdkReady(true)
          script.onerror = () => setPaypalError("Failed to load PayPal SDK. Please refresh and try again.")
          document.body.appendChild(script)
        }
      })
      .catch(() => setPaypalError("Failed to load PayPal configuration."))
  }, [])

  useEffect(() => {
    if (!sdkReady || !selectedPlan || !paypalRef.current) return

    if (buttonsRef.current) {
      try { buttonsRef.current.close() } catch {}
      buttonsRef.current = null
    }

    paypalRef.current.innerHTML = ""

    if (!window.paypal) return

    const buttons = window.paypal.Buttons({
      style: { layout: "vertical", height: 50, color: "blue", shape: "rect", label: "paypal" },
      createOrder: async () => {
        setPaypalError(null)
        setLoading(true)
        try {
          const res = await fetch("/api/payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pathway: selectedPlan }),
          })
          const result = await res.json()
          if (result.paypalOrderId) {
            setLoading(false)
            return result.paypalOrderId
          }
          const errMsg = result.error || "Failed to create PayPal order."
          setPaypalError(errMsg)
          setLoading(false)
          throw new Error(errMsg)
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Failed to initiate payment."
          setPaypalError(msg)
          setLoading(false)
          throw err
        }
      },
      onApprove: async (details: { orderID: string }) => {
        setLoading(true)
        try {
          const captureRes = await fetch("/api/payment/capture", {
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
          setPaymentSuccess(true)
          window.dispatchEvent(new Event("payment-completed"))
        } catch {
          setPaypalError("Payment capture failed. Please try again.")
          setLoading(false)
        }
      },
      onError: (err: unknown) => {
        console.error("PayPal error:", err)
        setPaypalError("Payment error occurred. Please try again.")
        setLoading(false)
      },
    })

    buttons.render(paypalRef.current)
    buttonsRef.current = buttons

    return () => {
      try { buttons.close() } catch {}
    }
  }, [sdkReady, selectedPlan])

  if (paymentSuccess) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
            <p className="mt-2 text-gray-600">
              Welcome to the TBP Global Strategist Fellowship. Your payment has been confirmed.
            </p>
            <Button className="mt-6" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Fellowship Payment</h1>
        <p className="mt-2 text-gray-600">
          Select your fellowship pathway and complete payment to become a TBP Global Strategist Fellow.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {(["STANDARD", "PLUS"] as const).map((planKey) => {
          const plan = PLANS[planKey]
          const isSelected = selectedPlan === planKey
          return (
            <Card
              key={planKey}
              className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-indigo-600 shadow-lg" : "hover:shadow-md"}`}
              onClick={() => setSelectedPlan(planKey)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {planKey === "PLUS" ? <Star className="h-5 w-5 text-indigo-600" /> : <Zap className="h-5 w-5 text-gray-600" />}
                    {plan.name}
                  </CardTitle>
                  <span className="text-2xl font-bold text-gray-900">{plan.display}</span>
                </div>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedPlan && (
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <div>
                  <p className="font-semibold text-gray-900">{PLANS[selectedPlan].name}</p>
                  <p className="text-sm text-gray-500">Programme Fee</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{PLANS[selectedPlan].display}</p>
              </div>

              {sdkReady ? (
                <div ref={paypalRef} />
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                  <Loader2 size={16} className="animate-spin" />
                  PayPal is loading. Please wait...
                </div>
              )}

              {paypalError && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {paypalError}
                </div>
              )}

              {loading && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing payment...</span>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-xs text-green-700">
                <Shield size={14} />
                <span>Your payment is secured with 256-bit SSL encryption via PayPal</span>
              </div>

              {isTestMode && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="mb-2 text-xs font-semibold text-amber-700">Test Mode</p>
                  <p className="mb-3 text-xs text-amber-600">Skip payment to test without real charges.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    onClick={async () => {
                      setLoading(true)
                      try {
                        const res = await fetch("/api/payment/capture", {
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
                        setPaymentSuccess(true)
                        window.dispatchEvent(new Event("payment-completed"))
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
            </CardContent>
          </Card>
        </div>
      )}

      {!selectedPlan && (
        <p className="mt-6 text-center text-sm text-gray-500">
          Select a fellowship plan above to proceed with payment.
        </p>
      )}
    </div>
  )
}
