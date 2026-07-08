"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { StageBadge } from "@/components/ui/stage-badge"
import { ArrowUpDown } from "lucide-react"

const stageOrder = ["CANDIDATE", "STRATEGIST", "CONTRIBUTOR", "PROJECT_ALIGNED", "SECTOR_LEAD", "PAID_ADVISER"] as const

export function ChangeStageDialog({
  userId,
  userName,
  currentStage,
}: {
  userId: string
  userName: string
  currentStage: string | null
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState(currentStage ?? "CANDIDATE")
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}/stage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message ?? "Failed to update stage")
      }
      toast.success(`Stage updated to ${stage}`)
      setOpen(false)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update stage")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <ArrowUpDown size={13} className="mr-2" />
          Change Stage
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Progression Stage</DialogTitle>
          <DialogDescription>
            Update the TBP Global Strategist stage for <strong>{userName}</strong>.
            They will receive a notification and email about this change.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {stageOrder.map((s) => {
            const idx = stageOrder.indexOf(s as typeof stageOrder[number])
            const currentIdx = stageOrder.indexOf(currentStage as typeof stageOrder[number] | undefined)
            return (
              <label
                key={s}
                className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  stage === s ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                }`}
              >
                <input
                  type="radio"
                  name="stage"
                  value={s}
                  checked={stage === s}
                  onChange={() => setStage(s)}
                  className="accent-primary"
                />
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      idx <= currentIdx ? "bg-primary" : "bg-muted-foreground/20"
                    }`}
                  />
                  <StageBadge stage={s} />
                </div>
              </label>
            )
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || stage === currentStage}>
            {saving ? "Saving..." : "Update Stage"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
