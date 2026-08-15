"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { signIn } from "next-auth/react"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { StepApplicationForm } from "./step-application-form"
import { StepPersonalDetails } from "./step-personal-details"
import { StepProfessionalBackground } from "./step-professional-background"
import { StepFieldOfInterest } from "./step-field-of-interest"
import { StepPathway } from "../onboarding/step-pathway"
import { StepTentativeProject } from "./step-tentative-project"
import { StepObjectives } from "./step-objectives"
import { StepTerms } from "./step-terms"
import { StepPayment } from "./step-payment"
import { StepComplete } from "./step-complete"

const STEPS = [
  { id: 1, label: "Application" },
  { id: 2, label: "Personal" },
  { id: 3, label: "Background" },
  { id: 4, label: "Interest" },
  { id: 5, label: "Pathway" },
  { id: 6, label: "Project" },
  { id: 7, label: "Objectives" },
  { id: 8, label: "Terms" },
  { id: 9, label: "Payment" },
  { id: 10, label: "Complete" },
]

function ApplicationContent() {
  const searchParams = useSearchParams()
  const initialStep = parseInt(searchParams.get("step") || "1")
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [application, setApplication] = useState<Record<string, unknown> | null>(null)
  const [saving, setSaving] = useState(false)
  const [pathway, setPathway] = useState<string>("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const refParam = searchParams.get("ref") || ""

  useEffect(() => {
    fetch("/api/apply")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setApplication(data)
          setIsLoggedIn(data.isLoggedIn === true)
          if (data.pathway) setPathway(data.pathway as string)
          if (data.currentStep && data.currentStep > 1) {
            setCurrentStep(data.currentStep)
          }
        }
        setLoaded(true)
      })
      .catch(() => {
        setLoaded(true)
      })
  }, [])

  useEffect(() => {
    const step = searchParams.get("step")
    const sessionId = searchParams.get("session_id")
    if (step) setCurrentStep(parseInt(step))
    if (sessionId) {
      setCurrentStep(10)
      handlePaymentSuccess()
    }
  }, [searchParams])

  const handlePaymentSuccess = async () => {
    await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: 10, paymentProvider: "STRIPE" }),
    })
  }

  const saveStep = useCallback(async (stepData: Record<string, unknown>) => {
    setSaving(true)
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: currentStep, ...stepData }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      // Step 1 returns needsSignIn — authenticate client-side
      if (data.needsSignIn && stepData.email && stepData.password) {
        const signInResult = await signIn("credentials", {
          email: stepData.email as string,
          password: stepData.password as string,
          redirect: false,
        })
        if (signInResult?.error) {
          throw new Error("Sign in failed. Please try again.")
        }
        setIsLoggedIn(true)
        // Refetch application data to get saved fields for returning user
        const refetchRes = await fetch("/api/apply")
        const refetchData = await refetchRes.json()
        if (refetchData && !refetchData.error) {
          setApplication(refetchData)
          if (refetchData.currentStep && refetchData.currentStep > 1) {
            setCurrentStep(refetchData.currentStep)
          }
          return
        }
      }

      setApplication(data)
      if (data.isLoggedIn !== undefined) setIsLoggedIn(data.isLoggedIn)
    } finally {
      setSaving(false)
    }
  }, [currentStep])

  const nextStep = async (stepData?: Record<string, unknown>) => {
    if (stepData) {
      if (stepData.pathway) setPathway(stepData.pathway as string)
      await saveStep(stepData)
    }
    if (currentStep < 10) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepApplicationForm data={application} isLoggedIn={isLoggedIn} referralCode={refParam} onNext={nextStep} saving={saving} />
      case 2: return <StepPersonalDetails data={application} onNext={nextStep} onBack={prevStep} />
      case 3: return <StepProfessionalBackground data={application} onNext={nextStep} onBack={prevStep} />
      case 4: return <StepFieldOfInterest data={application} onNext={nextStep} onBack={prevStep} />
      case 5: return <StepPathway data={application} onNext={nextStep} onBack={prevStep} />
      case 6: return <StepTentativeProject data={application} pathway={pathway} onNext={nextStep} onBack={prevStep} />
      case 7: return <StepObjectives data={application} onNext={nextStep} onBack={prevStep} />
      case 8: return <StepTerms data={application} pathway={pathway} onNext={nextStep} onBack={prevStep} saving={saving} />
      case 9: return <StepPayment data={application} pathway={pathway} onNext={nextStep} onBack={prevStep} />
      case 10: return <StepComplete data={application} />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            TBP Global Strategist Institute
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Fellowship Application &amp; Programme Terms
          </p>
        </div>

        <div className="mb-10 overflow-x-auto">
          <div className="flex min-w-max items-center justify-between">
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
                  <span className="mt-1 hidden text-xs text-gray-500 sm:block">{step.label}</span>
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

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {!loaded ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center py-16">
                <Loader2 size={24} className="mx-auto animate-spin text-gray-400" />
                <p className="mt-3 text-sm text-gray-500">Loading...</p>
              </div>
            ) : renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function ApplicationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    }>
      <ApplicationContent />
    </Suspense>
  )
}
