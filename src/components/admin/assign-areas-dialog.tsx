"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Layers, Plus, X, Check } from "lucide-react"

type WorkArea = {
  id: string
  name: string
  slug: string
}

export function AssignAreasDialog({
  userId,
  userName,
}: {
  userId: string
  userName: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [areas, setAreas] = useState<WorkArea[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newAreaName, setNewAreaName] = useState("")
  const [creating, setCreating] = useState(false)

  const fetchAreas = useCallback(async () => {
    try {
      const [allRes, userRes] = await Promise.all([
        fetch("/api/admin/work-areas"),
        fetch(`/api/admin/users/${userId}/areas`),
      ])
      if (allRes.ok) {
        const allAreas = await allRes.json()
        setAreas(allAreas)
      }
      if (userRes.ok) {
        const userAreas = await userRes.json()
        setSelectedIds(new Set(userAreas.map((a: WorkArea) => a.id)))
      }
    } catch {
      toast.error("Failed to load work areas")
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (open) {
      setLoading(true)
      fetchAreas()
    }
  }, [open, fetchAreas])

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleCreateArea() {
    const name = newAreaName.trim()
    if (!name) return
    setCreating(true)
    try {
      const res = await fetch("/api/admin/work-areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message ?? "Failed to create area")
      }
      const area = await res.json()
      setAreas((prev) => [...prev, area].sort((a, b) => a.name.localeCompare(b.name)))
      setSelectedIds((prev) => new Set(prev).add(area.id))
      setNewAreaName("")
      toast.success(`Area "${name}" created`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create area")
    } finally {
      setCreating(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}/areas`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workAreaIds: Array.from(selectedIds) }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message ?? "Failed to assign areas")
      }
      toast.success("Work areas assigned")
      setOpen(false)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to assign areas")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Layers size={13} className="mr-2" />
          Assign Work Areas
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Work Areas</DialogTitle>
          <DialogDescription>
            Select the work areas for <strong>{userName}</strong> to work on.
            They will be notified of the assignment.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-3 py-2">
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => {
                const selected = selectedIds.has(area.id)
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => toggle(area.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-muted-foreground/30"
                    }`}
                  >
                    {selected && <Check size={12} />}
                    {area.name}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Input
                placeholder="New area name..."
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                className="h-8 text-xs"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateArea()
                }}
              />
              <Button
                type="button"
                size="sm"
                className="h-8 gap-1 text-xs"
                onClick={handleCreateArea}
                disabled={creating || !newAreaName.trim()}
              >
                {creating ? (
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Plus size={12} />
                )}
                Add
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? "Saving..." : "Save Assignments"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
