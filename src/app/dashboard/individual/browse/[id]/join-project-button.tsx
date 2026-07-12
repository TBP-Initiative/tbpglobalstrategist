"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, Check } from "lucide-react"

export function JoinProjectButton({ projectId }: { projectId: string }) {
  const [status, setStatus] = useState<"idle" | "joining" | "joined">("idle")
  const router = useRouter()

  const handleJoin = async () => {
    if (status !== "idle") return
    setStatus("joining")
    try {
      const res = await fetch(`/api/projects/${projectId}/join`, { method: "POST" })
      if (res.ok) {
        setStatus("joined")
        router.refresh()
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
    <Button
      className="w-full gap-1.5"
      size="sm"
      onClick={handleJoin}
      disabled={status === "joining"}
    >
      <Sparkles size={14} />
      {status === "joining" ? "Joining..." : "Start Project"}
    </Button>
  )
}
