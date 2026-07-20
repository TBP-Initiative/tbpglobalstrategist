"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Check, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepPathwayProps {
  data: Record<string, unknown> | null
  onNext: (data: Record<string, unknown>) => void
  onBack: () => void
}

export function StepPathway({ data, onNext, onBack }: StepPathwayProps) {
  const [selected, setSelected] = useState<string>((data?.pathway as string) || "")

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-gray-900">Fellowship Pathway Selection</h2>
      <p className="mt-1 text-sm text-gray-500">Section 5 of the Agreement / Programme Terms Form</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {/* Standard */}
        <button
          type="button"
          onClick={() => setSelected("STANDARD")}
          className={cn(
            "relative rounded-2xl border-2 p-6 text-left transition-all",
            selected === "STANDARD"
              ? "border-primary bg-primary/5 shadow-md"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          {selected === "STANDARD" && (
            <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
              <Check size={14} />
            </div>
          )}
          <h3 className="text-lg font-bold text-gray-900">Standard Fellowship</h3>
          <p className="mt-1 text-2xl font-bold text-primary">US$1,200</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0 text-green-500" /> Guided learning pathway</li>
            <li className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0 text-green-500" /> TBP Global Strategist Portal access</li>
            <li className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0 text-green-500" /> Project assignments</li>
            <li className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0 text-green-500" /> Public or private profile creation</li>
            <li className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0 text-green-500" /> Portfolio support</li>
            <li className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0 text-green-500" /> Certificate of Completion</li>
          </ul>
        </button>

        {/* Plus */}
        <button
          type="button"
          onClick={() => setSelected("PLUS")}
          className={cn(
            "relative rounded-2xl border-2 p-6 text-left transition-all",
            selected === "PLUS"
              ? "border-primary bg-primary/5 shadow-md"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <div className="absolute right-3 top-3">
            <Zap size={20} className="text-amber-500" />
          </div>
          {selected === "PLUS" && (
            <div className="absolute right-3 top-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
              <Check size={14} />
            </div>
          )}
          <h3 className="text-lg font-bold text-gray-900">Fellowship Plus</h3>
          <p className="mt-1 text-2xl font-bold text-primary">US$1,500</p>
          <p className="mt-1 text-xs font-medium text-amber-600">Everything in Standard, plus:</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0 text-green-500" /> Individual pathway review</li>
            <li className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0 text-green-500" /> Enhanced one-to-one guidance</li>
            <li className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0 text-green-500" /> Additional portfolio support</li>
            <li className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0 text-green-500" /> Professionally structured contribution profile</li>
            <li className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0 text-green-500" /> Personalised progression review</li>
          </ul>
        </button>
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
