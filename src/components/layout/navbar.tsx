"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  User,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/components/layout/theme-provider";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Strategists", href: "/strategists" },
  { label: "Corporates", href: "/corporates" },
  { label: "Projects", href: "/projects" },
  {
    label: "Resources",
    children: [
      { label: "Innovation", href: "/innovation" },
      { label: "Research", href: "/research" },
      { label: "Insights", href: "/insights" },
    ],
  },
  { label: "Summit", href: "/summit" },
  { label: "About", href: "/about" },
];

const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const mobileMenuVariants = {
  closed: { opacity: 0, x: "100%" },
  open: { opacity: 1, x: 0, transition: { type: "spring" as const, damping: 25, stiffness: 200 } },
};

const linkVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.05, duration: 0.3 },
  }),
};

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-strong shadow-lg shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-lg shadow-primary/25">
              <span className="text-xs font-bold text-white">TBP</span>
            </div>
            <span className="hidden text-lg font-semibold tracking-tight sm:inline-block">
              TBP Global Strategists
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                custom={i}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                className="relative"
              >
                {"children" in link ? (
                  <div className="group">
                    <span className="relative inline-flex cursor-default items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-fg transition-colors group-hover:text-fg">
                      {link.label}
                      <ChevronDown size={14} className="ml-1 transition-transform group-hover:rotate-180" />
                    </span>
                    <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="flex flex-col gap-1 rounded-xl border border-border bg-background p-2 shadow-xl min-w-[160px]">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                              isActive(child.href)
                                ? "bg-primary/10 text-primary"
                                : "text-muted-fg hover:bg-muted hover:text-fg"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-primary"
                        : "text-muted-fg hover:text-fg"
                    }`}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-lg bg-primary/10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                )}
              </motion.div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-fg transition-colors hover:bg-muted hover:text-fg"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {status === "loading" ? (
              <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
            ) : session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">
                    {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden text-sm font-medium md:inline-block">
                    {session.user.name || "User"}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-muted-fg transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
                      >
                        <div className="border-b border-border px-4 py-3">
                          <p className="text-sm font-medium">{session.user.name}</p>
                          <p className="text-xs text-muted-fg">{session.user.email}</p>
                        </div>
                        <div className="p-1">
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <LayoutDashboard size={16} />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User size={16} />
                            Profile
                          </Link>
                        </div>
                        <div className="border-t border-border p-1">
                          <button
                            onClick={() => signOut()}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10"
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-muted-fg transition-colors hover:bg-muted hover:text-fg"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg shadow-lg shadow-primary/25 transition-all hover:opacity-90"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-fg transition-colors hover:bg-muted hover:text-fg lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-border bg-background lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-4 h-16">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                    <span className="text-xs font-bold text-white">TBP</span>
                  </div>
                  <span className="text-lg font-semibold tracking-tight">TBP</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-fg hover:bg-muted hover:text-fg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto px-4 py-6">
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) =>
                    "children" in link ? (
                      <div key={link.label} className="space-y-1">
                        <span className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-fg">
                          {link.label}
                          <ChevronDown size={14} className="ml-1" />
                        </span>
                        <div className="ml-3 flex flex-col gap-1 border-l border-border pl-3">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                isActive(child.href)
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-fg hover:bg-muted hover:text-fg"
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          isActive(link.href)
                            ? "bg-primary/10 text-primary"
                            : "text-muted-fg hover:bg-muted hover:text-fg"
                        }`}
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </nav>

                <div className="mt-6 border-t border-border pt-6">
                  {session?.user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-sm font-bold text-white">
                          {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{session.user.name}</p>
                          <p className="text-xs text-muted-fg">{session.user.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-fg transition-colors hover:bg-muted hover:text-fg"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-fg shadow-lg shadow-primary/25 transition-all hover:opacity-90"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
