"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { StepDetails } from "./step-details"
import { StepOverview } from "./step-overview"
import { StepPathway } from "./step-pathway"
import { StepTerms } from "./step-terms"
import { StepAgreement } from "./step-agreement"
import { StepPayment } from "./step-payment"
import { StepComplete } from "./step-complete"

const STEPS = [
  { id: 1, label: "Details" },
  { id: 2, label: "Overview" },
  { id: 3, label: "Pathway" },
  { id: 4, label: "Terms" },
  { id: 5, label: "Agreement" },
  { id: 6, label: "Payment" },
  { id: 7, label: "Complete" },
]

export default function OnboardingPage() {
  const searchParams = useSearchParams()
  const initialStep = parseInt(searchParams.get("step") || "1")
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [onboarding, setOnboarding] = useState<Record<string, unknown> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/onboarding")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.id) {
          setOnboarding(data)
          if (data.currentStep && data.currentStep > 1) {
            setCurrentStep(data.currentStep)
          }
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const step = searchParams.get("step")
    const sessionId = searchParams.get("session_id")
    if (step) setCurrentStep(parseInt(step))
    if (sessionId) {
      setCurrentStep(7)
      handlePaymentSuccess()
    }
  }, [searchParams])

  const handlePaymentSuccess = async () => {
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: 7 }),
    })
  }

  const saveStep = async (stepData: Record<string, unknown>) => {
    setSaving(true)
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: currentStep, ...stepData }),
      })
      const data = await res.json()
      setOnboarding(data)
    } finally {
      setSaving(false)
    }
  }

  const nextStep = async (stepData?: Record<string, unknown>) => {
    if (stepData) await saveStep(stepData)
    if (currentStep < 7) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepDetails data={onboarding} onNext={nextStep} saving={saving} />
      case 2: return <StepOverview data={onboarding} onNext={nextStep} onBack={prevStep} />
      case 3: return <StepPathway data={onboarding} onNext={nextStep} onBack={prevStep} />
      case 4: return <StepTerms data={onboarding} onNext={nextStep} onBack={prevStep} />
      case 5: return <StepAgreement data={onboarding} onNext={nextStep} onBack={prevStep} saving={saving} />
      case 6: return <StepPayment data={onboarding} onNext={nextStep} onBack={prevStep} />
      case 7: return <StepComplete data={onboarding} />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            TBP Global Strategist Fellowship
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Agreement &amp; Programme Terms
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                      currentStep > step.id
                        ? "bg-green-500 text-white"
                        : currentStep === step.id
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-500"
                    )}
                  >
                    {currentStep > step.id ? <Check size={14} /> : step.id}
                  </div>
                  <span className="mt-1 text-xs text-gray-500 hidden sm:block">{step.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-1 h-0.5 w-6 sm:w-12",
                      currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
