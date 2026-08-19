"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Check, ArrowUpRight, X } from "lucide-react"

export function JoinProjectButton({ projectId }: { projectId: string }) {
  const [status, setStatus] = useState<"idle" | "joining" | "joined">("idle")
  const [mismatch, setMismatch] = useState<{ projectPathwayLabel: string; userPathwayLabel: string } | null>(null)
  const router = useRouter()

  const handleJoin = async () => {
    if (status !== "idle") return
    setStatus("joining")
    try {
      const res = await fetch(`/api/projects/${projectId}/join`, { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setStatus("joined")
        router.refresh()
      } else if (data.pathwayMismatch) {
        setMismatch({ projectPathwayLabel: data.projectPathwayLabel, userPathwayLabel: data.userPathwayLabel })
        setStatus("idle")
      } else {
        setStatus("idle")
      }
    } catch {
      setStatus("idle")
    }
  }

  if (status === "joined") {
    return (
      <Button className="w-full gap-1.5" size="sm" variant="outline">
        <Check size={14} />
        Project Joined
      </Button>
    )
  }

  return (
    <>
      <Button
        className="w-full gap-1.5"
        size="sm"
        onClick={handleJoin}
        disabled={status === "joining"}
      >
        <Sparkles size={14} />
        {status === "joining" ? "Joining..." : "Start Project"}
      </Button>

      {mismatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            <button
              onClick={() => setMismatch(null)}
              className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={16} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <ArrowUpRight size={24} className="text-amber-600" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-900">Pathway Upgrade Required</h3>

            <p className="mt-2 text-sm text-gray-600">
              This project is available for <strong>{mismatch.projectPathwayLabel}</strong> participants only.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Your current pathway: <strong>{mismatch.userPathwayLabel}</strong>
            </p>

            <p className="mt-3 text-sm text-gray-600">
              To access this project, you need to upgrade your pathway. Contact us to learn about upgrade options and pricing differences.
            </p>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setMismatch(null)}
              >
                Close
              </Button>
              <Link href="/contact" className="flex-1">
                <Button className="w-full gap-1.5">
                  Upgrade Pathway
                  <ArrowUpRight size={14} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
