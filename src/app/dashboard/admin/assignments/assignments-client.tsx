"use client"

import { useMemo, useState } from "react"
import { GlassCard } from "@/components/shared/glass-card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ClipboardCheck, Search, Loader2, User } from "lucide-react"

interface AssessorOption {
  id: string
  name: string | null
  email: string
}

interface Student {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string
  createdAt: string
  assessorId: string | null
  assessor: { id: string; name: string | null; email: string } | null
  stage: string | null
  onboardingStatus: string | null
  source: string | null
  records: number
  submissions: number
}

const stageLabels: Record<string, string> = {
  CANDIDATE: "Candidate",
  STRATEGIST: "Strategist",
  CONTRIBUTOR: "Contributor",
  PROJECT_ALIGNED: "Project-Aligned",
  SECTOR_LEAD: "Sector Lead",
  PAID_ADVISER: "Paid Adviser",
}

function initials(name: string | null, email: string | null) {
  const source = name || email || "?"
  return source
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function AssignmentsClient({
  students,
  assessors,
}: {
  students: Student[]
  assessors: AssessorOption[]
}) {
  const [assignments, setAssignments] = useState<Record<string, string>>(
    Object.fromEntries(students.map((s) => [s.id, s.assessorId ?? ""])),
  )
  const [savingId, setSavingId] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return students
    return students.filter((s) =>
      [s.name, s.email, s.assessor?.name].some((v) => v?.toLowerCase().includes(q)),
    )
  }, [students, query])

  const assignedCount = Object.values(assignments).filter(Boolean).length

  async function handleChange(student: Student, value: string) {
    const previous = assignments[student.id] ?? ""
    setAssignments((prev) => ({ ...prev, [student.id]: value }))
    setSavingId(student.id)
    try {
      const res = await fetch("/api/admin/assessor-assignments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: student.id, assessorId: value || null }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to save")
      }
      toast.success(value ? "Assessor assigned" : "Assessor removed")
    } catch (err) {
      setAssignments((prev) => ({ ...prev, [student.id]: previous }))
      toast.error(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <ClipboardCheck className="text-indigo-600" />
            Assessor Assignments
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Assign each student or applicant to an assessor. Reviews are routed only to the assigned assessor.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-center">
            <p className="text-xl font-bold text-indigo-600">{assignedCount}</p>
            <p className="text-[11px] uppercase tracking-wide text-gray-400">Assigned</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-center">
            <p className="text-xl font-bold text-gray-700">{students.length}</p>
            <p className="text-[11px] uppercase tracking-wide text-gray-400">Students</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search students or assessors..."
          className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:border-indigo-400 focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <GlassCard className="p-12 text-center" intensity="light">
          <User size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No students or applicants found</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((student) => {
            const current = assignments[student.id] ?? ""
            const isSaving = savingId === student.id
            const typeLabel =
              student.source === "INSTITUTE_APPLICATION"
                ? "Applicant"
                : student.source === "ONBOARDING"
                  ? "Fellow"
                  : student.role

            return (
              <GlassCard key={student.id} className="p-4" intensity="light">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                      {student.image ? (
                        <img src={student.image} alt={student.name || ""} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        initials(student.name, student.email)
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {student.name || student.email}
                        </p>
                        <Badge variant="outline" className="text-[10px]">
                          {typeLabel}
                        </Badge>
                        {student.stage && (
                          <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-600 border-indigo-200">
                            {stageLabels[student.stage] ?? student.stage}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{student.email}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {student.records} DESQUELET record{student.records === 1 ? "" : "s"} ·{" "}
                        {student.submissions} submission{student.submissions === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSaving && <Loader2 size={14} className="animate-spin text-gray-400" />}
                    <select
                      value={current}
                      onChange={(e) => handleChange(student, e.target.value)}
                      disabled={isSaving}
                      className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-indigo-400 focus:outline-none"
                    >
                      <option value="">Unassigned</option>
                      {assessors.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name || a.email}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
