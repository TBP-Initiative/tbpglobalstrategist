"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Check, Zap, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepPathwayProps {
  data: Record<string, unknown> | null
  onNext: (data: Record<string, unknown>) => void
  onBack: () => void
}

const PATHWAYS: Record<string, { name: string; price: string; duration: string; features: string[] }> = {
  STANDARD: {
    name: "TBP Global Strategist Fellowship",
    price: "£1,500",
    duration: "12\u201324 weeks",
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
    name: "Applied R&D & Technology Development",
    price: "£7,500",
    duration: "16\u201324 weeks",
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

export function StepPathway({ data, onNext, onBack }: StepPathwayProps) {
  const [selected, setSelected] = useState<string>((data?.pathway as string) || "")

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-gray-900">Choose the Pathway That Fits Your Development Journey</h2>
      <p className="mt-1 text-sm text-gray-500">Two Fellowship pathways. One-off programme fees.</p>
      <p className="mt-1 text-xs text-gray-400">Projected duration 12\u201324 weeks. Applied R&D typically 16\u201324 weeks.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {Object.entries(PATHWAYS).map(([key, plan]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelected(key)}
            className={cn(
              "relative rounded-2xl border-2 p-6 text-left transition-all",
              selected === key
                ? "border-primary bg-primary/5 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            {key === "PLUS" && (
              <div className="absolute right-3 top-3">
                <Zap size={20} className="text-amber-500" />
              </div>
            )}
            {selected === key && (
              <div
                className={cn(
                  "absolute flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white",
                  key === "PLUS" ? "right-3 top-10" : "right-3 top-3"
                )}
              >
                <Check size={14} />
              </div>
            )}
            <h3 className="pr-6 text-lg font-bold text-gray-900">{plan.name}</h3>
            <p className="mt-1 text-2xl font-bold text-primary">{plan.price}</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-500">
              <Clock size={12} />
              {plan.duration} | One-off programme fee
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check size={14} className="mt-0.5 shrink-0 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} className="rounded-full px-6">
          <ChevronLeft size={16} className="mr-1" /> Back
        </Button>
        <Button onClick={() => onNext({ pathway: selected })} disabled={!selected} className="rounded-full px-8">
          Continue <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  )
}
