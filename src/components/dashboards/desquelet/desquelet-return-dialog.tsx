"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DESQUELET_STAGE_MAP, DESQUELET_STAGE_ORDER, type DesqueletStageKey } from "@/lib/desquelet-prompts"
import { RotateCcw, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReturnToStageDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (fromStage: DesqueletStageKey, toStage: DesqueletStageKey, reason: string) => void
  currentStage: DesqueletStageKey
}

export function DesqueletReturnDialog({
  isOpen,
  onClose,
  onConfirm,
  currentStage,
}: ReturnToStageDialogProps) {
  const [selectedStage, setSelectedStage] = useState<DesqueletStageKey | null>(null)
  const [reason, setReason] = useState("")

  const currentIndex = DESQUELET_STAGE_ORDER.indexOf(currentStage)
  const availableStages = DESQUELET_STAGE_ORDER.slice(0, currentIndex)

  const handleConfirm = () => {
    if (!selectedStage || !reason.trim()) return
    onConfirm(currentStage, selectedStage, reason)
    setSelectedStage(null)
    setReason("")
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <RotateCcw size={18} />
                Return to Previous Stage
              </h3>
              <button onClick={onClose} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-white/60 mb-4">
              Select which stage you want to return to and explain why.
            </p>

            <div className="space-y-2 mb-4">
              {availableStages.map((key) => {
                const config = DESQUELET_STAGE_MAP[key]
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedStage(key)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                      selectedStage === key
                        ? "border-blue-500/50 bg-blue-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    )}
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-white/70 text-sm font-bold">
                      {config.letter}
                    </span>
                    <span className="text-sm text-white/80">{config.name}</span>
                  </button>
                )
              })}
            </div>

            {selectedStage && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mb-4"
              >
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why are you returning to this stage? What changed or was discovered?"
                  className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </motion.div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-white/20 text-white/70"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!selectedStage || !reason.trim()}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <RotateCcw size={14} className="mr-1" />
                Create Iteration
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
