"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FolderKanban,
  BarChart3,
  Settings,
  Users,
  Shield,
  MessageSquare,
  ChevronDown,
  ChevronLeft,
  Share2,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
  children?: { label: string; href: string }[];
};

type Role = "individual" | "admin";

const navConfig: Record<Role, { title: string; items: NavItem[] }[]> = {
  individual: [
    {
      title: "Main",
      items: [
        { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { label: "Profile", href: "/dashboard/profile", icon: User },
        { label: "My Projects", href: "/dashboard/projects", icon: FolderKanban },
        { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
        { label: "Referrals", href: "/dashboard/referrals", icon: Share2 },
      ],
    },
    {
      title: "Settings",
      items: [
        { label: "Account", href: "/dashboard/settings", icon: Settings },
      ],
    },
  ],
  admin: [
    {
      title: "Main",
      items: [
        { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { label: "Profile", href: "/dashboard/profile", icon: User },
        { label: "Users", href: "/dashboard/users", icon: Users },
        { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
        { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
        { label: "Referrals", href: "/dashboard/admin/referrals", icon: Share2 },
      ],
    },
    {
      title: "Administration",
      items: [
        { label: "System", href: "/dashboard/system", icon: Shield },
        { label: "Settings", href: "/dashboard/settings", icon: Settings },
      ],
    },
  ],
};

interface SidebarProps {
  role?: Role;
  collapsed?: boolean;
  onToggle?: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    organization?: string;
  };
}

export default function Sidebar({
  role = "individual",
  collapsed = false,
  onToggle,
  user,
}: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const sections = navConfig[role] || navConfig.individual;

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`flex flex-col border-r border-border bg-background transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-primary">
              <span className="text-xs font-bold text-white">TBP</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {user?.name || "User"}
              </p>
              {user?.organization && (
                <p className="truncate text-xs text-muted-fg">
                  {user.organization}
                </p>
              )}
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-muted-fg transition-colors hover:bg-muted hover:text-fg ${
            collapsed ? "mx-auto" : ""
          }`}
        >
          <ChevronLeft
            size={16}
            className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            {!collapsed && (
              <button
                onClick={() => toggleSection(section.title)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-fg transition-colors hover:text-fg"
              >
                {section.title}
                <ChevronDown
                  size={12}
                  className={`transition-transform ${
                    expandedSections[section.title] !== false ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
            <AnimatePresence mode="wait">
              {(expandedSections[section.title] !== false || collapsed) && (
                <motion.div
                  initial={collapsed ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-0.5 overflow-hidden"
                >
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    if (item.children) {
                      return (
                        <div key={item.label}>
                          <button
                            onClick={() => toggleSection(item.label)}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                              active
                                ? "bg-muted text-fg font-medium"
                                : "text-muted-fg hover:bg-muted hover:text-fg"
                            }`}
                          >
                            <Icon size={18} className="shrink-0" />
                            {!collapsed && (
                              <>
                                <span className="flex-1 text-left">{item.label}</span>
                                <ChevronDown
                                  size={14}
                                  className={`transition-transform ${
                                    expandedSections[item.label] ? "rotate-180" : ""
                                  }`}
                                />
                              </>
                            )}
                          </button>
                        </div>
                      );
                    }

                      return (
                        <Link
                          key={item.label}
                          href={item.href || "#"}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                            active
                              ? "bg-muted text-fg font-medium"
                              : "text-muted-fg hover:bg-muted hover:text-fg"
                          }`}
                        >
                          <Icon size={18} className="shrink-0" />
                          {!collapsed && <span>{item.label}</span>}
                        </Link>
                      );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>
    </aside>
  );
}
