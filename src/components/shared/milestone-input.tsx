"use client"

import { useState } from "react"
import { Plus, Trash2, CheckCircle2, Circle, Milestone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PREDEFINED_MILESTONES, milestoneWeight } from "@/lib/project-utils"

type MilestoneData = {
  id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
  sortOrder: number
  weight: number
}

export function MilestoneInput({
  milestones,
  onChange,
  readOnly,
}: {
  milestones: MilestoneData[]
  onChange: (milestones: MilestoneData[]) => void
  readOnly?: boolean
}) {
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newDueDate, setNewDueDate] = useState("")

  function addMilestone(title?: string) {
    const t = title ?? newTitle.trim()
    if (!t) return
    onChange([
      ...milestones,
      {
        id: `new-${Date.now()}`,
        title: t,
        description: "",
        dueDate: newDueDate,
        completed: false,
        sortOrder: milestones.length,
        weight: milestoneWeight(t),
      },
    ])
    if (!title) {
      setNewTitle("")
      setNewDescription("")
      setNewDueDate("")
    }
  }

  function removeMilestone(id: string) {
    onChange(milestones.filter((m) => m.id !== id))
  }

  function toggleCompleted(id: string) {
    onChange(
      milestones.map((m) =>
        m.id === id ? { ...m, completed: !m.completed } : m
      )
    )
  }

  function updateMilestone(id: string, field: keyof MilestoneData, value: string | boolean | number) {
    onChange(milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const addedTitles = new Set(milestones.map((m) => m.title))

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Milestone size={14} className="text-muted-foreground" />
        Milestones
        <span className="text-xs font-normal text-muted-foreground ml-auto">
          {milestones.filter((m) => m.completed).length}/{milestones.length} completed
        </span>
      </h3>

      {/* Predefined milestones */}
      {!readOnly && (
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-2">Quick-add preset milestones:</p>
          <div className="flex flex-wrap gap-1.5">
            {PREDEFINED_MILESTONES.map((pm) => {
              const alreadyAdded = addedTitles.has(pm.title)
              return (
                <Badge
                  key={pm.title}
                  variant={alreadyAdded ? "default" : "outline"}
                  className={`cursor-pointer text-xs px-2 py-1 ${alreadyAdded ? "bg-primary/20 text-primary border-primary/30" : "hover:bg-muted"}`}
                  onClick={() => {
                    if (alreadyAdded) return
                    addMilestone(pm.title)
                  }}
                >
                  {alreadyAdded ? <CheckCircle2 size={10} className="mr-1" /> : <Plus size={10} className="mr-1" />}
                  {pm.title} ({pm.weight}%)
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      {/* Milestone list */}
      <div className="space-y-2 mb-3">
        {milestones.map((m) => (
          <div
            key={m.id}
            className="flex items-start gap-2 rounded-lg border border-border p-3"
          >
            <button
              type="button"
              onClick={() => toggleCompleted(m.id)}
              className="mt-0.5 shrink-0"
              disabled={readOnly}
            >
              {m.completed ? (
                <CheckCircle2 size={16} className="text-green-500" />
              ) : (
                <Circle size={16} className="text-muted-foreground" />
              )}
            </button>
            <div className="min-w-0 flex-1 space-y-1.5">
              <Input
                value={m.title}
                onChange={(e) => updateMilestone(m.id, "title", e.target.value)}
                placeholder="Milestone title"
                className="h-7 text-sm"
                disabled={readOnly}
              />
              <Textarea
                value={m.description}
                onChange={(e) => updateMilestone(m.id, "description", e.target.value)}
                placeholder="Description (optional)"
                className="min-h-[40px] text-xs"
                rows={1}
                disabled={readOnly}
              />
              <Input
                type="date"
                value={m.dueDate ? m.dueDate.slice(0, 10) : ""}
                onChange={(e) => updateMilestone(m.id, "dueDate", e.target.value)}
                className="h-7 text-xs w-40"
                disabled={readOnly}
              />
            </div>
            {!readOnly && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => removeMilestone(m.id)}
              >
                <Trash2 size={13} />
              </Button>
            )}
          </div>
        ))}
        {milestones.length === 0 && (
          <p className="text-xs text-muted-foreground">No milestones yet</p>
        )}
      </div>

      {/* Custom milestone input */}
      {!readOnly && (
        <div className="flex gap-2 items-start">
          <div className="flex-1 space-y-1.5">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Or type a custom milestone title"
              className="h-8 text-sm"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addMilestone() } }}
            />
            <div className="flex gap-2">
              <Input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="h-7 text-xs w-40"
              />
              <Input
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description (optional)"
                className="h-7 text-xs flex-1"
              />
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0"
            onClick={() => addMilestone()}
            disabled={!newTitle.trim()}
          >
            <Plus size={14} className="mr-1" />
            Add
          </Button>
        </div>
      )}
    </div>
  )
}
