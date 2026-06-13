"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Search,
  Bell,
  MessageSquare,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "/strategist-portal" },
  { label: "Strategists", href: "/strategist-portal/strategists" },
  { label: "Projects", href: "/strategist-portal/projects" },
  { label: "Initiatives", href: "/strategist-portal/initiatives" },
  { label: "Insights", href: "/strategist-portal/insights" },
  { label: "Network", href: "/strategist-portal/network" },
];

const AVATAR_URL = "https://i.pravatar.cc/80?u=strategist-portal-user";

const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const drawerVariants = {
  closed: { opacity: 0, x: "100%" },
  open: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 200 },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.04, duration: 0.3 },
  }),
};

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const isActive = (href: string) => {
    if (href === "/strategist-portal") return pathname === "/strategist-portal";
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-black/40 backdrop-blur-xl border-b border-white/5"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LEFT: Logo + Portal text */}
          <Link href="/strategist-portal" className="flex items-center gap-3 group shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/25">
              <span className="text-xs font-bold text-white tracking-tight">TBP</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-semibold tracking-wide text-white/90">
                GLOBAL STRATEGIST
              </span>
              <span className="text-sm font-semibold tracking-wide text-indigo-400">
                {" "}PORTAL
              </span>
            </div>
          </Link>

          {/* CENTER: Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                custom={i}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  href={link.href}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "text-white"
                      : "text-white/50 hover:text-white/80"
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="portal-nav-indicator"
                      className="absolute inset-0 rounded-lg bg-white/10 border border-white/10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-1.5">
            {/* Search toggle */}
            <div className="relative flex items-center">
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.div
                    key="search-input"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search portal..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-1.5 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-400/50 transition-colors"
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
              <button
                onClick={() => setSearchOpen((p) => !p)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition-colors hover:text-white hover:bg-white/10",
                  searchOpen && "text-white bg-white/10"
                )}
                aria-label="Toggle search"
              >
                <Search size={16} />
              </button>
            </div>

            {/* Notification bell */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition-colors hover:text-white hover:bg-white/10">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-1 ring-black/40" />
            </button>

            {/* Message icon */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition-colors hover:text-white hover:bg-white/10">
              <MessageSquare size={16} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-1 ring-black/40" />
            </button>

            {/* User avatar */}
            <div className="ml-1.5 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/20 transition-all hover:ring-indigo-400/50">
              <img
                src={AVATAR_URL}
                alt="User avatar"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition-colors hover:text-white hover:bg-white/10 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-white/10 bg-black/80 backdrop-blur-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 h-16">
                <Link href="/strategist-portal" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                    <span className="text-xs font-bold text-white">TBP</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold tracking-wide text-white/90">GLOBAL</span>
                    <span className="text-sm font-semibold tracking-wide text-indigo-400"> PORTAL</span>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto px-4 py-6">
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive(link.href)
                          ? "bg-white/10 text-white border border-white/10"
                          : "text-white/50 hover:bg-white/5 hover:text-white/80"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-6 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/20">
                      <img
                        src={AVATAR_URL}
                        alt="User avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/90">Strategist</p>
                      <p className="text-xs text-white/40">strategist@tbp.global</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
