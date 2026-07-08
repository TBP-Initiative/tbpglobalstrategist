"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { RichTextEditor } from "@/components/shared/rich-text-editor"
import { ImageUpload } from "@/components/shared/image-upload"
import { MilestoneInput } from "@/components/shared/milestone-input"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { StatsCard } from "@/components/dashboards/stats-card"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { exportToCSV } from "@/lib/export"
import {
  FolderKanban,
  Search,
  MoreHorizontal,
  TrendingUp,
  Download,
  Plus,
  CheckCircle2,
  FileText,
  XCircle,
  Star,
  Loader2,
  Pencil,
  Trash2,
  Link2,
  X,
  Video,
  Upload,
} from "lucide-react"

type ProjectData = {
  id: string
  title: string
  slug: string
  status: string
  budget: string | null
  createdAt: string
  isFeatured: boolean
  featuredAt: string | null
  image: string | null
  category: string | null
  description: string | null
  shortDescription: string | null
  objectives: string | null
  strategicRelevance: string | null
  startDate: string | null
  endDate: string | null
  organization: { id?: string; name: string; slug: string } | null
  createdBy: { id?: string; name: string | null; email: string }
  contributors: number
}

type OrganizationData = {
  id: string
  name: string
  slug: string
}

function parseCategories(cat: string | null | undefined): string[] {
  if (!cat) return []
  try {
    const parsed = JSON.parse(cat)
    return Array.isArray(parsed) ? parsed : [cat]
  } catch {
    return [cat]
  }
}

const statusConfig: Record<string, { label: string; class: string }> = {
  ACTIVE: { label: "Active", class: "bg-green-500/10 text-green-500 border-green-500/20" },
  DRAFT: { label: "Draft", class: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  COMPLETED: { label: "Completed", class: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  CANCELLED: { label: "Cancelled", class: "bg-red-500/10 text-red-500 border-red-500/20" },
}

function NewProjectDialog({
  open,
  onOpenChange,
  onCreated,
  organizations,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (project: ProjectData) => void
  organizations: OrganizationData[]
}) {
  const [title, setTitle] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [description, setDescription] = useState("")
  const [objectives, setObjectives] = useState("")
  const [strategicRelevance, setStrategicRelevance] = useState("")
  const [status, setStatus] = useState("DRAFT")
  const [budget, setBudget] = useState("")
  const [organizationId, setOrganizationId] = useState("")
  const [newOrgName, setNewOrgName] = useState("")
  const [creatingOrg, setCreatingOrg] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [image, setImage] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [categoryInput, setCategoryInput] = useState("")
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [relationSearch, setRelationSearch] = useState("")
  const [relationResults, setRelationResults] = useState<{ id: string; title: string; slug: string; category: string | null }[]>([])
  const [relatedProjects, setRelatedProjects] = useState<{ relationType: string; relatedProject: { id: string; title: string; slug: string; image: string | null; category: string | null; status: string } }[]>([])
  const [media, setMedia] = useState<{ id: string; type: string; url: string; title: string | null; fileType: string | null }[]>([])
  const [mediaUrl, setMediaUrl] = useState("")
  const [mediaType, setMediaType] = useState("DOCUMENT")
  const [mediaTitle, setMediaTitle] = useState("")
  const [milestones, setMilestones] = useState<{ id: string; title: string; description: string; dueDate: string; completed: boolean; sortOrder: number; weight: number }[]>([])

  let searchTimeout: ReturnType<typeof setTimeout>
  function searchProjects(q: string) {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(async () => {
      try {
        const params = q.trim() ? `q=${encodeURIComponent(q.trim())}` : "q="
        const res = await fetch(`/api/projects/search?${params}`)
        if (!res.ok) return
        setRelationResults(await res.json())
      } catch {}
    }, q.trim() ? 300 : 0)
  }

  useEffect(() => {
    fetch("/api/projects/categories").then(r => r.ok && r.json()).then(data => { if (data) setAvailableCategories(data) }).catch(() => {})
  }, [])

  async function handleSubmit() {
    setError("")
    if (!title.trim()) {
      setError("Title is required")
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          shortDescription: shortDescription.trim() || undefined,
          description: description || undefined,
          objectives: objectives.trim() || undefined,
          strategicRelevance: strategicRelevance.trim() || undefined,
          image: image.trim() || undefined,
          categories: categories.length > 0 ? categories : undefined,
          status,
          budget: budget ? Number(budget) : undefined,
          organizationId: organizationId || undefined,
          newOrganizationName: newOrgName.trim() || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Failed to create project")
      }
      const project = await res.json()
      const pid = project.id

      for (const rp of relatedProjects) {
        if (rp.relatedProject.id === pid) continue
        await fetch(`/api/projects/${pid}/relations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ relatedProjectId: rp.relatedProject.id, relationType: "RELATED" }),
        })
      }

      for (const m of media) {
        await fetch(`/api/projects/${pid}/media`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: m.url, type: m.type, title: m.title, fileType: m.fileType }),
        })
      }

      for (const ms of milestones) {
        await fetch(`/api/projects/${pid}/milestones`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: ms.title, description: ms.description || undefined, dueDate: ms.dueDate || undefined, completed: ms.completed, sortOrder: ms.sortOrder, weight: ms.weight }),
        })
      }

      onCreated(project)
      toast.success("Project created")
      onOpenChange(false)
      reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project")
    } finally {
      setSaving(false)
    }
  }

  function reset() {
    setTitle("")
    setShortDescription("")
    setDescription("")
    setObjectives("")
    setStrategicRelevance("")
    setImage("")
    setStatus("DRAFT")
    setBudget("")
    setOrganizationId("")
    setStartDate("")
    setEndDate("")
    setCategories([])
    setCategoryInput("")
    setCategoryDropdownOpen(false)
    setError("")
    setRelatedProjects([])
    setMedia([])
    setMilestones([])
    setRelationSearch("")
    setRelationResults([])
    setMediaUrl("")
    setMediaTitle("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>Create a new platform project</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input id="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="Brief summary for cards" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Full Description <span className="text-muted-foreground text-xs">(rich text supported)</span></Label>
            <RichTextEditor value={description} onChange={setDescription} placeholder="Project description with formatting..." minHeight="160px" />
          </div>
          <ImageUpload value={image} onChange={setImage} label="Featured Image" />
          <div className="space-y-2">
            <Label htmlFor="objectives">Objectives (one per line)</Label>
            <Textarea id="objectives" value={objectives} onChange={(e) => setObjectives(e.target.value)} placeholder="Objective 1&#10;Objective 2&#10;Objective 3" rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="strategicRelevance">Strategic Relevance</Label>
            <Textarea id="strategicRelevance" value={strategicRelevance} onChange={(e) => setStrategicRelevance(e.target.value)} placeholder="Strategic relevance of this project" rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {categories.map((c) => (
                <Badge key={c} variant="outline" className="gap-1 pr-1 text-xs">
                  {c}
                  <button type="button" onClick={() => setCategories((prev) => prev.filter((x) => x !== c))} className="hover:text-red-400 transition-colors">
                    <X size={10} />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="relative">
              <Input
                placeholder="Search or type new category..."
                value={categoryInput}
                onChange={(e) => { setCategoryInput(e.target.value); setCategoryDropdownOpen(true) }}
                onFocus={() => setCategoryDropdownOpen(true)}
                onBlur={() => setTimeout(() => setCategoryDropdownOpen(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault()
                    const val = (e.key === "," ? categoryInput.replace(/,/g, "") : categoryInput).trim()
                    if (val && !categories.includes(val)) {
                      setCategories((prev) => [...prev, val])
                    }
                    setCategoryInput("")
                  }
                }}
                className="h-8 text-xs"
              />
              {categoryDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-popover max-h-40 overflow-y-auto shadow-lg">
                  {availableCategories
                    .filter((c) => !categories.includes(c) && (!categoryInput.trim() || c.toLowerCase().includes(categoryInput.toLowerCase())))
                    .map((c) => (
                      <button
                        key={c}
                        type="button"
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-muted/50 transition-colors"
                        onMouseDown={(e) => { e.preventDefault(); setCategories((prev) => [...prev, c]); setCategoryInput(""); setCategoryDropdownOpen(false) }}
                      >
                        <Plus size={12} className="shrink-0 text-muted-foreground" />
                        {c}
                      </button>
                    ))}
                  {categoryInput.trim() && !availableCategories.some((c) => c.toLowerCase() === categoryInput.trim().toLowerCase()) && (
                    <button
                      type="button"
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs text-primary hover:bg-muted/50 transition-colors"
                      onMouseDown={(e) => { e.preventDefault(); setCategories((prev) => [...prev, categoryInput.trim()]); setCategoryInput(""); setCategoryDropdownOpen(false) }}
                    >
                      <Plus size={12} />
                      Add "{categoryInput.trim()}"
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status" placeholder="Select status...">
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input id="budget" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="250000" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="org">Organization</Label>
            <Select value={organizationId} onValueChange={(val) => { setOrganizationId(val); if (val !== "_new") setNewOrgName("") }}>
              <SelectTrigger id="org" placeholder="Select organization...">
              </SelectTrigger>
              <SelectContent>
                {organizations.map((o) => (
                  <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                ))}
                <SelectItem value="_new">+ Create new organization</SelectItem>
              </SelectContent>
            </Select>
            {organizationId === "_new" && (
              <Input
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                placeholder="Enter new organization name"
                className="mt-1"
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <Separator className="my-2" />

        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Link2 size={14} className="text-muted-foreground" />
            Related Projects
          </h3>
          <div className="space-y-2 mb-3">
            {relatedProjects.map((rp) => (
              <div key={rp.relatedProject.id} className="flex items-center justify-between rounded-lg border border-border p-2">
                  <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{rp.relatedProject.title}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[10px] px-1">{rp.relationType}</Badge>
                    {parseCategories(rp.relatedProject.category).map((c) => (
                      <Badge key={c} variant="outline" className="text-[10px] px-1">{c}</Badge>
                    ))}
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0 ml-2" onClick={() => setRelatedProjects((prev) => prev.filter((r) => r.relatedProject.id !== rp.relatedProject.id))}>
                  <X size={13} />
                </Button>
              </div>
            ))}
            {relatedProjects.length === 0 && <p className="text-xs text-muted-foreground">No related projects selected</p>}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search old projects to link..."
                value={relationSearch}
                onChange={(e) => { setRelationSearch(e.target.value); searchProjects(e.target.value) }}
                onFocus={() => { if (!relationSearch) searchProjects("") }}
                className="h-8 w-full rounded-lg border border-border bg-muted pl-8 pr-3 text-xs text-fg placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          {relationResults.length > 0 && (
            <p className="text-[10px] text-muted-foreground mt-1">{relationResults.filter((rp) => !relatedProjects.some((r) => r.relatedProject.id === rp.id)).length} projects available</p>
          )}
          {relationResults.length > 0 && (
            <div className="mt-2 rounded-lg border border-border max-h-40 overflow-y-auto">
              {relationResults
                .filter((rp) => !relatedProjects.some((r) => r.relatedProject.id === rp.id))
                .map((rp) => (
                  <button
                    key={rp.id}
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setRelatedProjects((prev) => [...prev, { relationType: "RELATED", relatedProject: { id: rp.id, title: rp.title, slug: rp.slug, image: null, category: rp.category, status: "DRAFT" } }])
                      setRelationSearch("")
                      setRelationResults([])
                      toast.success("Project linked")
                    }}
                  >
                    <Plus size={14} className="shrink-0 text-muted-foreground" />
                    <span className="truncate">{rp.title}</span>
                    {parseCategories(rp.category).map((c) => (
                      <Badge key={c} variant="outline" className="text-[10px] px-1 ml-auto shrink-0">{c}</Badge>
                    ))}
                  </button>
                ))}
            </div>
          )}
        </div>

        <Separator className="my-2" />

        <MilestoneInput
          milestones={milestones}
          onChange={setMilestones}
        />

        <Separator className="my-2" />

        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FileText size={14} className="text-muted-foreground" />
            Documents & Media
          </h3>
          <div className="space-y-2 mb-3">
            {media.map((m) => (
              <div key={m.url + m.type} className="flex items-center justify-between rounded-lg border border-border p-2">
                <div className="min-w-0 flex-1 flex items-center gap-2">
                  {m.type === "YOUTUBE" || m.type === "VIMEO" ? <Video size={14} className="shrink-0 text-muted-foreground" /> : <FileText size={14} className="shrink-0 text-muted-foreground" />}
                  <div className="min-w-0">
                    <p className="text-sm truncate">{m.title ?? m.url}</p>
                    <p className="text-xs text-muted-foreground">{m.type}</p>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0 ml-2" onClick={() => setMedia((prev) => prev.filter((mm) => mm.url !== m.url || mm.type !== m.type))}>
                  <Trash2 size={13} />
                </Button>
              </div>
            ))}
            {media.length === 0 && <p className="text-xs text-muted-foreground">No media attached</p>}
          </div>
          <MediaInput
            mediaUrl={mediaUrl} setMediaUrl={setMediaUrl}
            mediaType={mediaType} setMediaType={setMediaType}
            mediaTitle={mediaTitle} setMediaTitle={setMediaTitle}
            onAdd={(url, type, title) => {
              setMedia((prev) => [...prev, { id: "", type, url, title, fileType: null }])
              setMediaUrl(""); setMediaTitle("")
            }}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => { reset(); onOpenChange(false) }}>Cancel</Button>
          <Button type="button" onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onUpdated,
  organizations,
}: {
  project: ProjectData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: (project: ProjectData) => void
  organizations: OrganizationData[]
}) {
  const [title, setTitle] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [description, setDescription] = useState("")
  const [objectives, setObjectives] = useState("")
  const [strategicRelevance, setStrategicRelevance] = useState("")
  const [status, setStatus] = useState("DRAFT")
  const [budget, setBudget] = useState("")
  const [organizationId, setOrganizationId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [image, setImage] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [categoryInput, setCategoryInput] = useState("")
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [relationSearch, setRelationSearch] = useState("")
  const [relationResults, setRelationResults] = useState<{ id: string; title: string; slug: string; category: string | null }[]>([])
  const [relatedProjects, setRelatedProjects] = useState<{ relationType: string; relatedProject: { id: string; title: string; slug: string; image: string | null; category: string | null; status: string } }[]>([])
  const [media, setMedia] = useState<{ id: string; type: string; url: string; title: string | null; fileType: string | null }[]>([])
  const [mediaUrl, setMediaUrl] = useState("")
  const [mediaType, setMediaType] = useState("DOCUMENT")
  const [mediaTitle, setMediaTitle] = useState("")
  const [milestones, setMilestones] = useState<{ id: string; title: string; description: string; dueDate: string; completed: boolean; sortOrder: number; weight: number }[]>([])
  const [originalMilestoneIds, setOriginalMilestoneIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch("/api/projects/categories").then(r => r.ok && r.json()).then(data => { if (data) setAvailableCategories(data) }).catch(() => {})
  }, [])

  useEffect(() => {
    if (project) {
      setTitle(project.title)
      setShortDescription(project.shortDescription ?? "")
      setDescription(project.description ?? "")
      setObjectives(project.objectives ?? "")
      setStrategicRelevance(project.strategicRelevance ?? "")
      setStatus(project.status)
      setBudget(project.budget ?? "")
      setOrganizationId(project.organization?.id ?? "")
      setStartDate(project.startDate ? project.startDate.slice(0, 10) : "")
      setEndDate(project.endDate ? project.endDate.slice(0, 10) : "")
      setImage(project.image ?? "")
      setCategories(parseCategories(project.category))
      fetchRelated(project.id)
      fetchMedia(project.id)
      fetchMilestones(project.id)
    }
  }, [project])

  async function fetchRelated(pid: string) {
    try {
      const res = await fetch(`/api/projects/${pid}`)
      if (!res.ok) return
      const data = await res.json()
      if (data.relations) setRelatedProjects(data.relations)
    } catch {}
  }

  async function fetchMedia(pid: string) {
    try {
      const res = await fetch(`/api/projects/${pid}`)
      if (!res.ok) return
      const data = await res.json()
      if (data.media) setMedia(data.media)
    } catch {}
  }

  async function fetchMilestones(pid: string) {
    try {
      const res = await fetch(`/api/projects/${pid}/milestones`)
      if (!res.ok) return
      const data = await res.json()
      const ms = data.map((m: { id: string; title: string; description: string | null; dueDate: string | null; completed: boolean; sortOrder: number; completedAt: string | null; weight: number }) => ({
        id: m.id,
        title: m.title,
        description: m.description ?? "",
        dueDate: m.dueDate ? m.dueDate.slice(0, 10) : "",
        completed: m.completed,
        sortOrder: m.sortOrder,
        weight: m.weight ?? 1,
      }))
      setMilestones(ms)
      setOriginalMilestoneIds(new Set(ms.map((m: { id: string }) => m.id)))
    } catch {}
  }

  let searchTimeout: ReturnType<typeof setTimeout>
  function searchProjects(q: string) {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(async () => {
      try {
        const params = q.trim() ? `q=${encodeURIComponent(q.trim())}` : "q="
        const res = await fetch(`/api/projects/search?${params}&exclude=${project?.id ?? ""}`)
        if (!res.ok) return
        setRelationResults(await res.json())
      } catch {}
    }, q.trim() ? 300 : 0)
  }

  async function handleSubmit() {
    if (!project) return
    setError("")
    if (!title.trim()) {
      setError("Title is required")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          shortDescription: shortDescription.trim() || undefined,
          description: description || undefined,
          image: image.trim() || undefined,
          objectives: objectives.trim() || undefined,
          strategicRelevance: strategicRelevance.trim() || undefined,
          categories: categories.length > 0 ? categories : undefined,
          status,
          budget: budget ? Number(budget) : undefined,
          organizationId: organizationId || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Failed to update project")
      }
      const updated = await res.json()
      const pid = project.id

      const currentIds = new Set(milestones.filter((m) => !m.id.startsWith("new-")).map((m) => m.id))
      for (const oldId of originalMilestoneIds) {
        if (!currentIds.has(oldId)) {
          await fetch(`/api/projects/${pid}/milestones/${oldId}`, { method: "DELETE" })
        }
      }
      for (const ms of milestones) {
        if (ms.id.startsWith("new-")) {
          await fetch(`/api/projects/${pid}/milestones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: ms.title, description: ms.description || undefined, dueDate: ms.dueDate || undefined, completed: ms.completed, sortOrder: ms.sortOrder, weight: ms.weight }),
          })
        } else {
          await fetch(`/api/projects/${pid}/milestones/${ms.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: ms.title, description: ms.description || undefined, dueDate: ms.dueDate || undefined, completed: ms.completed, sortOrder: ms.sortOrder, weight: ms.weight }),
          })
        }
      }

      onUpdated(updated)
      toast.success("Project updated")
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project")
    } finally {
      setSaving(false)
    }
  }

  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update project details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title <span className="text-red-500">*</span></Label>
            <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-shortDescription">Short Description</Label>
            <Input id="edit-shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="Brief summary for cards" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Full Description <span className="text-muted-foreground text-xs">(rich text supported)</span></Label>
            <RichTextEditor value={description} onChange={setDescription} placeholder="Project description with formatting..." minHeight="160px" />
          </div>
          <ImageUpload value={image} onChange={setImage} label="Featured Image" />
          <div className="space-y-2">
            <Label htmlFor="edit-objectives">Objectives (one per line)</Label>
            <Textarea id="edit-objectives" value={objectives} onChange={(e) => setObjectives(e.target.value)} placeholder="Objective 1&#10;Objective 2&#10;Objective 3" rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-strategicRelevance">Strategic Relevance</Label>
            <Textarea id="edit-strategicRelevance" value={strategicRelevance} onChange={(e) => setStrategicRelevance(e.target.value)} placeholder="Strategic relevance of this project" rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {categories.map((c) => (
                <Badge key={c} variant="outline" className="gap-1 pr-1 text-xs">
                  {c}
                  <button type="button" onClick={() => setCategories((prev) => prev.filter((x) => x !== c))} className="hover:text-red-400 transition-colors">
                    <X size={10} />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="relative">
              <Input
                placeholder="Search or type new category..."
                value={categoryInput}
                onChange={(e) => { setCategoryInput(e.target.value); setCategoryDropdownOpen(true) }}
                onFocus={() => setCategoryDropdownOpen(true)}
                onBlur={() => setTimeout(() => setCategoryDropdownOpen(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault()
                    const val = (e.key === "," ? categoryInput.replace(/,/g, "") : categoryInput).trim()
                    if (val && !categories.includes(val)) {
                      setCategories((prev) => [...prev, val])
                    }
                    setCategoryInput("")
                  }
                }}
                className="h-8 text-xs"
              />
              {categoryDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-popover max-h-40 overflow-y-auto shadow-lg">
                  {availableCategories
                    .filter((c) => !categories.includes(c) && (!categoryInput.trim() || c.toLowerCase().includes(categoryInput.toLowerCase())))
                    .map((c) => (
                      <button
                        key={c}
                        type="button"
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-muted/50 transition-colors"
                        onMouseDown={(e) => { e.preventDefault(); setCategories((prev) => [...prev, c]); setCategoryInput(""); setCategoryDropdownOpen(false) }}
                      >
                        <Plus size={12} className="shrink-0 text-muted-foreground" />
                        {c}
                      </button>
                    ))}
                  {categoryInput.trim() && !availableCategories.some((c) => c.toLowerCase() === categoryInput.trim().toLowerCase()) && (
                    <button
                      type="button"
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs text-primary hover:bg-muted/50 transition-colors"
                      onMouseDown={(e) => { e.preventDefault(); setCategories((prev) => [...prev, categoryInput.trim()]); setCategoryInput(""); setCategoryDropdownOpen(false) }}
                    >
                      <Plus size={12} />
                      Add "{categoryInput.trim()}"
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="edit-status" placeholder="Select status...">
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-budget">Budget ($)</Label>
              <Input id="edit-budget" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="250000" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-org">Organization</Label>
            <Select value={organizationId} onValueChange={setOrganizationId}>
              <SelectTrigger id="edit-org" placeholder="Select organization...">
              </SelectTrigger>
              <SelectContent>
                {organizations.map((o) => (
                  <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-startDate">Start Date</Label>
              <Input id="edit-startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-endDate">End Date</Label>
              <Input id="edit-endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <Separator className="my-2" />

        {/* Related Projects */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Link2 size={14} className="text-muted-foreground" />
            Related Projects
          </h3>
          <div className="space-y-2 mb-3">
            {relatedProjects.map((rp) => (
              <div key={rp.relatedProject.id} className="flex items-center justify-between rounded-lg border border-border p-2">
                <div className="min-w-0 flex-1">
                  <Link href={`/dashboard/projects/${rp.relatedProject.slug}`} target="_blank" className="text-sm font-medium hover:text-primary transition-colors">
                    {rp.relatedProject.title}
                  </Link>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[10px] px-1">{rp.relationType}</Badge>
                    {parseCategories(rp.relatedProject.category).map((c) => (
                      <Badge key={c} variant="outline" className="text-[10px] px-1">{c}</Badge>
                    ))}
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0 ml-2" onClick={async () => {
                  try {
                    const res = await fetch(`/api/projects/${project.id}/relations?relatedProjectId=${rp.relatedProject.id}`, { method: "DELETE" })
                    if (!res.ok) throw new Error("Failed to remove")
                    setRelatedProjects((prev) => prev.filter((r) => r.relatedProject.id !== rp.relatedProject.id))
                    toast.success("Relation removed")
                  } catch {
                    toast.error("Failed to remove relation")
                  }
                }}>
                  <X size={13} />
                </Button>
              </div>
            ))}
            {relatedProjects.length === 0 && (
              <p className="text-xs text-muted-foreground">No related projects</p>
            )}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search old projects to link..."
                value={relationSearch}
                onChange={(e) => {
                  setRelationSearch(e.target.value)
                  searchProjects(e.target.value)
                }}
                onFocus={() => { if (!relationSearch) searchProjects("") }}
                className="h-8 w-full rounded-lg border border-border bg-muted pl-8 pr-3 text-xs text-fg placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          {relationResults.length > 0 && (
            <p className="text-[10px] text-muted-foreground mt-1">{relationResults.filter((rp) => rp.id !== project.id && !relatedProjects.some((r) => r.relatedProject.id === rp.id)).length} projects available</p>
          )}
          {relationResults.length > 0 && (
            <div className="mt-2 rounded-lg border border-border max-h-40 overflow-y-auto">
              {relationResults
                .filter((rp) => rp.id !== project.id && !relatedProjects.some((r) => r.relatedProject.id === rp.id))
                .map((rp) => (
                  <button
                    key={rp.id}
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors"
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/projects/${project.id}/relations`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ relatedProjectId: rp.id, relationType: "RELATED" }),
                        })
                        if (!res.ok) throw new Error("Failed to add")
                        const data = await res.json()
                        setRelatedProjects((prev) => [...prev, data])
                        setRelationSearch("")
                        setRelationResults([])
                        toast.success("Project linked")
                      } catch {
                        toast.error("Failed to add relation")
                      }
                    }}
                  >
                    <Plus size={14} className="shrink-0 text-muted-foreground" />
                    <span className="truncate">{rp.title}</span>
                    {parseCategories(rp.category).map((c) => (
                      <Badge key={c} variant="outline" className="text-[10px] px-1 ml-auto shrink-0">{c}</Badge>
                    ))}
                  </button>
                ))}
            </div>
          )}
        </div>

        <Separator className="my-2" />

        <MilestoneInput
          milestones={milestones}
          onChange={setMilestones}
        />

        <Separator className="my-2" />

        {/* Media */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FileText size={14} className="text-muted-foreground" />
            Documents & Media
          </h3>
          <div className="space-y-2 mb-3">
            {media.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-border p-2">
                <div className="min-w-0 flex-1 flex items-center gap-2">
                  {m.type === "YOUTUBE" || m.type === "VIMEO" ? <Video size={14} className="shrink-0 text-muted-foreground" /> : <FileText size={14} className="shrink-0 text-muted-foreground" />}
                  <div className="min-w-0">
                    <p className="text-sm truncate">{m.title ?? m.url}</p>
                    <p className="text-xs text-muted-foreground">{m.type} {m.fileType ? `· ${m.fileType.toUpperCase()}` : ""}</p>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0 ml-2" onClick={async () => {
                  try {
                    const res = await fetch(`/api/projects/${project.id}/media?mediaId=${m.id}`, { method: "DELETE" })
                    if (!res.ok) throw new Error("Failed to delete")
                    setMedia((prev) => prev.filter((mm) => mm.id !== m.id))
                    toast.success("Media deleted")
                  } catch {
                    toast.error("Failed to delete media")
                  }
                }}>
                  <Trash2 size={13} />
                </Button>
              </div>
            ))}
            {media.length === 0 && (
              <p className="text-xs text-muted-foreground">No media attached</p>
            )}
          </div>
          <MediaInput
            mediaUrl={mediaUrl} setMediaUrl={setMediaUrl}
            mediaType={mediaType} setMediaType={setMediaType}
            mediaTitle={mediaTitle} setMediaTitle={setMediaTitle}
            onAdd={async (url, type, title) => {
              try {
                const res = await fetch(`/api/projects/${project.id}/media`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ url, type, title: title || undefined }),
                })
                if (!res.ok) throw new Error("Failed to add")
                const data = await res.json()
                setMedia((prev) => [...prev, data])
                setMediaUrl(""); setMediaTitle("")
                toast.success("Media added")
              } catch {
                toast.error("Failed to add media")
              }
            }}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function MediaInput({
  mediaUrl, setMediaUrl, mediaType, setMediaType, mediaTitle, setMediaTitle, onAdd, children,
}: {
  mediaUrl: string; setMediaUrl: (v: string) => void
  mediaType: string; setMediaType: (v: string) => void
  mediaTitle: string; setMediaTitle: (v: string) => void
  onAdd: (url: string, type: string, title: string | null) => void
  children?: React.ReactNode
}) {
  const [mode, setMode] = useState<"url" | "upload" | "library">("url")
  const [uploading, setUploading] = useState(false)
  const [library, setLibrary] = useState<{ url: string; name: string; size: number; uploadedAt: string }[]>([])
  const [loadingLibrary, setLoadingLibrary] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (mode === "library" && library.length === 0 && !loadingLibrary) {
      setLoadingLibrary(true)
      fetch("/api/uploads").then(r => r.ok ? r.json() : []).then(d => setLibrary(d ?? [])).catch(() => {}).finally(() => setLoadingLibrary(false))
    }
  }, [mode, library.length, loadingLibrary])

  async function handleFile(file: File | undefined) {
    if (!file) return
    const maxSize = file.type.startsWith("image/") ? 5 * 1024 * 1024 : 20 * 1024 * 1024
    if (file.size > maxSize) { toast.error(file.type.startsWith("image/") ? "Image must be under 5MB" : "File must be under 20MB"); return }
    setUploading(true)
    try {
      const fd = new FormData(); fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      const t = file.type.startsWith("image/") ? "IMAGE" : "DOCUMENT"
      onAdd(data.url, mediaType === "DOCUMENT" || mediaType === "IMAGE" ? mediaType : t, file.name.replace(/\.[^/.]+$/, "") || null)
      toast.success("File uploaded")
    } catch { toast.error("Upload failed") }
    finally { setUploading(false) }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const extMap: Record<string, string> = { pdf: "pdf", doc: "doc", docx: "docx", xls: "xls", xlsx: "xlsx", ppt: "ppt", pptx: "pptx", mp4: "mp4", webm: "webm", png: "png", jpg: "jpg", jpeg: "jpeg", gif: "gif", webp: "webp", svg: "svg" }

  return (
    <div>
      <div className="flex gap-1 mb-2">
        {(["url", "upload", "library"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className={`text-xs px-2 py-0.5 rounded ${mode === m ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-fg"}`}
          >
            {m === "url" ? "URL" : m === "upload" ? "Upload" : "Library"}
          </button>
        ))}
      </div>

      {mode === "url" ? (
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Media URL" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} className="h-8 text-xs" />
          <Select value={mediaType} onValueChange={setMediaType}>
            <SelectTrigger placeholder="Type" className="h-8 text-xs" />
            <SelectContent>
              <SelectItem value="DOCUMENT">Document</SelectItem>
              <SelectItem value="YOUTUBE">YouTube</SelectItem>
              <SelectItem value="VIMEO">Vimeo</SelectItem>
              <SelectItem value="VIDEO">Video</SelectItem>
              <SelectItem value="IMAGE">Image</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : mode === "upload" ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className="relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-4 transition-colors hover:border-primary/50"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload size={18} className="text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">Click or drag to upload</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Images, documents, videos (max 20MB)</p>
            </>
          )}
          <input ref={fileRef} type="file" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        </div>
      ) : (
        <div className="rounded-lg border border-border p-2">
          {loadingLibrary ? (
            <div className="flex items-center justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : library.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">No uploaded files found.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
              {library.map((f) => (
                <button
                  key={f.url}
                  type="button"
                  onClick={() => { onAdd(f.url, f.name.match(/\.(png|jpe?g|gif|webp|svg)$/i) ? "IMAGE" : "DOCUMENT", f.name.replace(/\.[^/.]+$/, "")); setMode("url") }}
                  className={`group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all`}
                >
                  {f.name.match(/\.(png|jpe?g|gif|webp|svg)$/i) ? (
                    <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${f.url})` }} />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
                      <FileText size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-2">
        <Input placeholder="Title (optional)" value={mediaTitle} onChange={(e) => setMediaTitle(e.target.value)} className="h-8 text-xs flex-1" />
        <Button type="button" size="sm" className="h-8 text-xs" onClick={() => {
          if (!mediaUrl.trim()) { toast.error("URL is required"); return }
          onAdd(mediaUrl.trim(), mediaType, mediaTitle.trim() || null)
          setMediaUrl(""); setMediaTitle("")
        }}>
          <Plus size={12} className="mr-1" />
          Add
        </Button>
      </div>
      {children}
    </div>
  )
}

export function ProjectsClient({
  projects: initialProjects,
  organizations,
  counts,
}: {
  projects: ProjectData[]
  organizations: OrganizationData[]
  counts: { total: number; active: number; draft: number; completed: number; cancelled: number }
}) {
  const router = useRouter()
  const [projects, setProjects] = useState(initialProjects)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [editProject, setEditProject] = useState<ProjectData | null>(null)

  async function toggleFeatured(id: string) {
    setTogglingId(id)
    try {
      const res = await fetch(`/api/projects/${id}/feature`, { method: "PATCH" })
      if (!res.ok) throw new Error("Failed to toggle")
      const data = await res.json()
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, isFeatured: data.isFeatured, featuredAt: data.featuredAt }
            : p
        )
      )
      toast.success(data.isFeatured ? "Project featured" : "Featured removed")
    } catch {
      toast.error("Failed to update featured status")
    } finally {
      setTogglingId(null)
    }
  }

  function handleCreated(project: ProjectData) {
    setProjects((prev) => [project, ...prev])
    setEditProject(project)
  }

  function handleUpdated(updated: ProjectData) {
    setProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    )
  }

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (filter !== "all" && p.status !== filter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          p.title.toLowerCase().includes(q) ||
          p.organization?.name.toLowerCase().includes(q) ||
          p.createdBy.name?.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [projects, filter, search])

  return (
    <div className="space-y-8">
      <NewProjectDialog
        open={newDialogOpen}
        onOpenChange={setNewDialogOpen}
        onCreated={handleCreated}
        organizations={organizations}
      />
      <EditProjectDialog
        project={editProject}
        open={editProject !== null}
        onOpenChange={(open) => { if (!open) setEditProject(null) }}
        onUpdated={handleUpdated}
        organizations={organizations}
      />

      <AnimatedSection>
        <PageHeader
          title="Projects"
          description="Manage all platform projects across organizations"
          actions={
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => {
                exportToCSV(
                  projects.map((p) => ({
                    Title: p.title,
                    Status: p.status,
                    Organization: p.organization?.name ?? "",
                    "Created By": p.createdBy.name ?? p.createdBy.email,
                    Budget: p.budget ? `$${Number(p.budget).toLocaleString()}` : "",
                    Contributors: p.contributors,
                    Created: new Date(p.createdAt).toLocaleDateString(),
                  })),
                  "projects-export"
                )
                toast.success("Projects exported")
              }}>
                <Download size={14} />
                Export
              </Button>
              <Button type="button" size="sm" className="gap-1.5" onClick={() => setNewDialogOpen(true)}>
                <Plus size={14} />
                New Project
              </Button>
            </div>
          }
        />
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard icon={<FolderKanban size={18} />} label="Total" value={String(counts.total)} delay={0} />
        <StatsCard icon={<TrendingUp size={18} />} label="Active" value={String(counts.active)} trend={{ value: 0, positive: true }} delay={0.05} />
        <StatsCard icon={<FileText size={18} />} label="Draft" value={String(counts.draft)} delay={0.1} />
        <StatsCard icon={<CheckCircle2 size={18} />} label="Completed" value={String(counts.completed)} delay={0.15} />
        <StatsCard icon={<XCircle size={18} />} label="Cancelled" value={String(counts.cancelled)} delay={0.2} />
      </div>

      <AnimatedSection delay={0.2}>
        <GlassCard className="p-6" intensity="light">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban size={16} className="text-muted-foreground" />
              <h2 className="text-lg font-semibold">All Projects</h2>
              <Badge variant="outline" className="text-[10px] px-1.5">{filtered.length} of {counts.total}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 rounded-lg border border-border bg-muted pl-8 pr-3 text-xs text-fg placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex gap-1">
                {["all", "ACTIVE", "DRAFT", "COMPLETED", "CANCELLED"].map((f) => (
                  <Button
                    key={f}
                    type="button"
                    variant={filter === f ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilter(f)}
                    className="h-7 text-xs capitalize"
                  >
                    {f === "all" ? "All" : f.toLowerCase()}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Featured</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Contributors</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((project) => {
                  const s = statusConfig[project.status] ?? { label: project.status, class: "" }
                  return (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div>
                          <Link href={`/dashboard/projects/${project.slug}`} className="text-sm font-medium hover:text-primary transition-colors">
                            {project.title}
                          </Link>
                          <p className="text-xs text-muted-foreground">by {project.createdBy.name ?? project.createdBy.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{project.organization?.name ?? "—"}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={s.class + " text-[10px] px-1.5"}>{s.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => toggleFeatured(project.id)}
                          disabled={togglingId === project.id}
                          className="group relative flex items-center gap-1.5 text-xs"
                          title={
                            project.isFeatured
                              ? `Featured since ${new Date(project.featuredAt!).toLocaleDateString()}`
                              : "Click to feature"
                          }
                        >
                          <Star
                            size={14}
                            className={cn(
                              "transition-all duration-200",
                              project.isFeatured
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/40 group-hover:text-muted-foreground/70"
                            )}
                          />
                          {project.isFeatured && project.featuredAt && (
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(project.featuredAt).toLocaleDateString()}
                            </span>
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {project.budget ? `$${Number(project.budget).toLocaleString()}` : "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{project.contributors}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditProject(project)} title="View / Edit">
                            <Pencil size={13} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button type="button" variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal size={13} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={async () => {
                                if (!confirm("Are you sure you want to delete this project?")) return
                                try {
                                  const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" })
                                  if (!res.ok) throw new Error("Failed to delete")
                                  setProjects((prev) => prev.filter((p) => p.id !== project.id))
                                  toast.success("Project deleted")
                                } catch {
                                  toast.error("Failed to delete project")
                                }
                              }}>
                                <Trash2 size={13} className="mr-2 text-red-500" />
                                <span className="text-red-500">Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No projects found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </GlassCard>
      </AnimatedSection>
    </div>
  )
}
