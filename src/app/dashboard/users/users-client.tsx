"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AnimatedSection } from "@/components/shared/animated-section"
import { GlassCard } from "@/components/shared/glass-card"
import { StatsCard } from "@/components/dashboards/stats-card"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { exportToCSV } from "@/lib/export"
import { AddUserDialog } from "@/components/admin/add-user-dialog"
import { DeleteUserDialog } from "@/components/admin/delete-user-dialog"
import { ChangeRoleDialog } from "@/components/admin/change-role-dialog"
import { ChangePasswordDialog } from "@/components/admin/change-password-dialog"
import {
  Users,
  UserCheck,
  UserX,
  Search,
  MoreHorizontal,
  Eye,
  Shield,
  Download,
  RefreshCw,
} from "lucide-react"

type UserData = {
  id: string
  name: string | null
  email: string
  role: string
  image: string | null
  createdAt: string
  projects: number
}

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-500/10 text-red-500 border-red-500/20",
  STRATEGIST: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  RESEARCHER: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  MODERATOR: "bg-green-500/10 text-green-500 border-green-500/20",
  PARTNER: "bg-pink-500/10 text-pink-500 border-pink-500/20",
}

export function UsersClient({ users, total }: { users: UserData[]; total: number }) {
  const router = useRouter()
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  const strategistCount = users.filter((u) => u.role === "STRATEGIST" || u.role === "RESEARCHER").length


  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (filter !== "all" && u.role !== filter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          u.name?.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [users, filter, search])

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <PageHeader
          title="User Management"
          description="Manage all platform users, roles, and permissions"
          actions={
            <div className="flex items-center gap-2">
              <AddUserDialog />
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => {
                exportToCSV(
                  users.map((u) => ({ Name: u.name ?? "Unnamed", Email: u.email, Role: u.role, Projects: u.projects, Joined: new Date(u.createdAt).toLocaleDateString() })),
                  "users-export"
                )
                toast.success("Users exported")
              }}>
                <Download size={14} />
                Export
              </Button>
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => router.refresh()}>
                <RefreshCw size={14} />
                Refresh
              </Button>
            </div>
          }
        />
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard icon={<Users size={18} />} label="Total Users" value={String(total)} trend={{ value: 0, positive: true }} description="All registered users" delay={0} />
        <StatsCard icon={<UserCheck size={18} />} label="Strategists & Researchers" value={String(strategistCount)} trend={{ value: 0, positive: true }} description="Active knowledge workers" delay={0.1} />
      </div>

      <AnimatedSection delay={0.2}>
        <GlassCard className="p-6" intensity="light">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-muted-foreground" />
              <h2 className="text-lg font-semibold">All Users</h2>
              <Badge variant="outline" className="text-[10px] px-1.5">{filtered.length} of {total}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 rounded-lg border border-border bg-muted pl-8 pr-3 text-xs text-fg placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex gap-1">
                {["all", "ADMIN", "STRATEGIST", "RESEARCHER", "MODERATOR"].map((f) => (
                  <Button
                    key={f}
                    type="button"
                    variant={filter === f ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilter(f)}
                    className="h-7 text-xs capitalize"
                  >
                    {f === "all" ? "All" : f.replace("_", " ").toLowerCase()}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback className="text-xs">
                            {user.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name ?? "Unnamed"}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={(roleColors[user.role] ?? "") + " text-[10px] px-1.5"}>
                        {user.role.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{user.projects}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.info(`Viewing ${user.name ?? "user"}`)}>
                          <Eye size={13} />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal size={13} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" sideOffset={4}>
                            <DropdownMenuItem onClick={() => toast.info(`Viewing ${user.name ?? "user"}`)}>
                              <Eye size={13} className="mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ChangeRoleDialog userId={user.id} userName={user.name ?? "Unnamed"} currentRole={user.role} />
                            <ChangePasswordDialog userId={user.id} userName={user.name ?? "Unnamed"} />
                            <DropdownMenuSeparator />
                            <DeleteUserDialog userId={user.id} userName={user.name ?? "Unnamed"} />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No users found matching your filters.
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
