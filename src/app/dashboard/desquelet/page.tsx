"use client"

import { useState, useEffect } from "react"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { DesqueletRecordCard } from "@/components/dashboards/desquelet/desquelet-record-card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { toast } from "sonner"
import { Layers, Plus, FolderKanban, ArrowRight } from "lucide-react"
import Link from "next/link"

interface RecordData {
  id: string
  title: string
  currentRevision: number
  overallProgress: number
  completedStages: number
  totalStages: number
  iterations: number
  milestones: number
  lastUpdated: string
  createdAt: string
  project?: { id: string; title: string; slug: string } | null
}

interface AvailableProject {
  id: string
  title: string
  slug: string
  status: string
}

export default function DesqueletRecordsPage() {
  const [records, setRecords] = useState<RecordData[]>([])
  const [availableProjects, setAvailableProjects] = useState<AvailableProject[]>([])
  const [loading, setLoading] = useState(true)
  const [startingId, setStartingId] = useState<string | null>(null)

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/desquelet/records")
      if (res.ok) {
        const data = await res.json()
        setRecords(data.records ?? [])
        setAvailableProjects(data.availableProjects ?? [])
      }
    } catch (err) {
      console.error("Failed to fetch DESQUELET records:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const handleStart = async (project: AvailableProject) => {
    if (startingId) return
    setStartingId(project.id)
    try {
      const res = await fetch("/api/desquelet/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, title: project.title }),
      })
      if (!res.ok) throw new Error("Failed to create record")
      toast.success("DESQUELET record created")
      await fetchRecords()
    } catch (err) {
      toast.error("Failed to create record")
    } finally {
      setStartingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Layers className="text-indigo-600" />
              DESQUELET Application Records
            </h1>
            <p className="text-gray-500 mt-1">
              Your live workspace for documenting DESQUELET methodology application
            </p>
          </div>
          <Link href="/dashboard/individual/browse">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus size={16} className="mr-2" />
              New Record
            </Button>
          </Link>
        </div>
      </AnimatedSection>

      {loading ? (
        <AnimatedSection delay={0.1}>
          <GlassCard className="flex items-center justify-center p-12" intensity="light">
            <LoadingSpinner />
          </GlassCard>
        </AnimatedSection>
      ) : records.length === 0 ? (
        <AnimatedSection delay={0.1}>
          <GlassCard className="p-12 text-center" intensity="light">
            <FolderKanban size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No DESQUELET Records Yet</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Join a project or start one below to create your first DESQUELET Application Record.
              Each record tracks your progress through the nine DESQUELET stages.
            </p>
            <Link href="/dashboard/individual/browse">
              <Button variant="outline" className="border-gray-200 text-gray-600 hover:text-gray-900">
                Browse Projects
              </Button>
            </Link>
          </GlassCard>
        </AnimatedSection>
      ) : (
        <div className="space-y-4">
          {records.map((record, index) => (
            <DesqueletRecordCard key={record.id} record={record} index={index} />
          ))}
        </div>
      )}

      {!loading && availableProjects.length > 0 && (
        <AnimatedSection delay={0.15}>
          <GlassCard className="p-6" intensity="light">
            <div className="flex items-center gap-2 mb-2">
              <FolderKanban size={16} className="text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-700">Your Existing Projects</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              You are a contributor to these projects but haven&apos;t started a DESQUELET record yet.
              Start one to apply the DESQUELET methodology to your work in that project.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{project.title}</p>
                    <p className="text-xs text-gray-400 capitalize">{project.status.toLowerCase()}</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 shrink-0"
                    disabled={startingId === project.id}
                    onClick={() => handleStart(project)}
                  >
                    {startingId === project.id ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                        Start DESQUELET
                        <ArrowRight size={14} className="ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </GlassCard>
        </AnimatedSection>
      )}

      <AnimatedSection delay={0.2}>
        <GlassCard className="p-6" intensity="light">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">About DESQUELET</h3>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
            {[
              { letter: "D", name: "Deep Understanding" },
              { letter: "E1", name: "Exploration of Systems" },
              { letter: "S", name: "Strategic Planning" },
              { letter: "Q", name: "Questioning" },
              { letter: "U", name: "Unique Framing" },
              { letter: "E2", name: "Effective Engagement" },
              { letter: "L", name: "Learning Through Simulation" },
              { letter: "E3", name: "Execution Model" },
              { letter: "T", name: "Transferability" },
            ].map((stage, i) => (
              <div key={i} className="text-center p-2 bg-gray-50 rounded-lg">
                <span className="text-lg font-bold text-indigo-600">{stage.letter}</span>
                <p className="text-[10px] text-gray-400 mt-1">{stage.name}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </AnimatedSection>
    </div>
  )
}