"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Search,
  ChevronRight,
  Home,
  Menu,
  X,
  MessageSquare,
  UserPlus,
  Shield,
  Award,
  Info,
  AlertTriangle,
} from "lucide-react";

const notifIcons: Record<string, React.ReactNode> = {
  SYSTEM: <Info size={14} />,
  MESSAGE: <MessageSquare size={14} />,
  PROJECT_INVITE: <Shield size={14} />,
  ACHIEVEMENT_UNLOCKED: <Award size={14} />,
}

const notifColors: Record<string, string> = {
  SYSTEM: "text-blue-500",
  MESSAGE: "text-purple-500",
  PROJECT_INVITE: "text-amber-500",
  ACHIEVEMENT_UNLOCKED: "text-green-500",
}

type NotifItem = {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  link: string | null
  createdAt: string
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: "individual" | "admin";
  user?: {
    name: string;
    email: string;
    organization?: string;
  };
}

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  profile: "Profile",
  projects: "Projects",
  messages: "Messages",
  settings: "Settings",
  team: "Team",
  analytics: "Analytics",
  account: "Account",
  users: "Users",
  organization: "Organization",
  system: "System",
};

export default function DashboardLayout({
  children,
  role = "individual",
  user,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications")
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.items ?? data)
        setUnreadCount(data.unreadCount ?? data.filter((n: NotifItem) => !n.read).length)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function markAsRead(id: string) {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch { /* ignore */ }
  }

  function formatNotifTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  }

  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    return {
      label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href,
    };
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden lg:flex">
        <Sidebar
          role={role}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          user={user}
        />
      </div>

      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar
              role={role}
              user={user}
              onToggle={() => setMobileSidebarOpen(false)}
            />
          </div>
        </>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-fg transition-colors hover:bg-muted hover:text-fg lg:hidden"
            >
              <Menu size={20} />
            </button>

            <nav className="hidden items-center gap-1.5 text-sm md:flex">
              <Link
                href="/"
                className="flex items-center gap-1 text-muted-fg transition-colors hover:text-fg"
              >
                <Home size={14} />
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.href} className="flex items-center gap-1.5">
                  <ChevronRight size={14} className="text-muted-fg" />
                  {index === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-fg">{crumb.label}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-muted-fg transition-colors hover:text-fg"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg"
              />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-56 rounded-lg border border-border bg-muted pl-9 pr-3 text-sm text-fg placeholder:text-muted-fg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div ref={notifRef} className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-fg transition-colors hover:bg-muted hover:text-fg"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-fg leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-background shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="text-sm font-semibold">Notifications</span>
                    <button type="button" onClick={() => setNotifOpen(false)} className="text-muted-fg hover:text-fg">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-muted-fg">No notifications yet</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => { markAsRead(n.id); if (n.link) window.location.href = n.link }}
                          className={`flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer ${n.read ? "" : "bg-muted/30"} hover:bg-muted/50`}
                        >
                          <div className={`mt-0.5 ${notifColors[n.type] ?? "text-muted-fg"}`}>
                            {notifIcons[n.type] ?? <UserPlus size={14} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${n.read ? "text-muted-fg" : "text-fg font-medium"}`}>
                              {n.title}
                            </p>
                            <p className="text-xs text-muted-fg truncate">{n.message}</p>
                            <p className="text-xs text-muted-fg mt-0.5">{formatNotifTime(n.createdAt)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <Link
                    href={`/${role}/notifications`}
                    className="block border-t border-border p-3 text-center text-xs text-primary hover:underline"
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
