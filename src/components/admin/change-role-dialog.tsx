"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Shield } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

const ROLES = [
  { value: "ADMIN", label: "Admin" },
  { value: "STRATEGIST", label: "Strategist" },
  { value: "RESEARCHER", label: "Researcher" },
  { value: "CORPORATE", label: "Corporate" },
  { value: "ORGANIZATION_ADMIN", label: "Organization Admin" },
  { value: "MODERATOR", label: "Moderator" },
  { value: "PARTNER", label: "Partner" },
] as const

interface ChangeRoleDialogProps {
  userId: string
  userName: string
  currentRole: string
}

export function ChangeRoleDialog({ userId, userName, currentRole }: ChangeRoleDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(currentRole)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSave() {
    if (selectedRole === currentRole) {
      setOpen(false)
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      })
      const result = await res.json()
      if (!res.ok) {
        toast.error(result.message || "Failed to update role")
        return
      }
      toast.success(`${userName} role changed to ${selectedRole.replace("_", " ")}`)
      setOpen(false)
      router.refresh()
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="flex w-full items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted/50 rounded-md">
          <Shield size={13} />
          Change Role
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
          <DialogDescription>
            Update role for <strong>{userName}</strong> (currently {currentRole.replace("_", " ")}).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>New Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger placeholder="Select role" />
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={handleSave} disabled={isLoading || selectedRole === currentRole} className="gap-1.5">
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
