"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: "individual" | "corporate" | "admin";
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
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const notifications = [
    { icon: <UserPlus size={14} />, text: "New user registered", time: "2m ago", color: "text-blue-500" },
    { icon: <MessageSquare size={14} />, text: "New message from Elena Voss", time: "15m ago", color: "text-purple-500" },
    { icon: <Shield size={14} />, text: "Project approval needed", time: "1h ago", color: "text-amber-500" },
    { icon: <Award size={14} />, text: "Strategist milestone achieved", time: "3h ago", color: "text-green-500" },
  ];

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
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
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
                    {notifications.map((n, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className={`mt-0.5 ${n.color}`}>{n.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-fg">{n.text}</p>
                          <p className="text-xs text-muted-fg">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border p-3 text-center">
                    <button type="button" className="text-xs text-primary hover:underline">View all notifications</button>
                  </div>
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
