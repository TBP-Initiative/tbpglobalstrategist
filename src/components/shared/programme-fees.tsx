import { Check, Zap } from "lucide-react"
import { PROGRAMMES } from "@/lib/programmes"

export function ProgrammeFees() {
  return (
    <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">Programme Fees</h2>
        <p className="text-xs text-gray-500">One-off programme fees</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {Object.entries(PROGRAMMES).map(([key, plan]) => (
          <div
            key={key}
            className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {key === "PLUS" ? (
                <Zap size={16} className="shrink-0 text-amber-500" />
              ) : (
                <Check size={16} className="shrink-0 text-primary" />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">{plan.name}</p>
                <p className="text-xs text-gray-500">{plan.duration} · one-off programme fee</p>
              </div>
            </div>
            <p className="shrink-0 text-lg font-bold text-gray-900">{plan.price}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-400">
        Fees are inclusive of programme access, mentorship, and certification. Payment is collected via PayPal or Stripe during the final step.
      </p>
    </div>
  )
}