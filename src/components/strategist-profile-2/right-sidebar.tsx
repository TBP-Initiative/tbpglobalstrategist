"use client";

import { motion } from "framer-motion";
import { MessageSquare, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface RightSidebarProps {
  projects: { id: string; title: string; category: string; image: string }[]
  collaborationStatus: string
  location: string
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.15, duration: 0.5, ease: "easeOut" },
  }),
};

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white shadow-lg shadow-black/5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function RightSidebar({ projects, collaborationStatus, location }: RightSidebarProps) {
  return (
    <aside className="flex flex-col gap-5">
      {/* CARD 1: Current TBP Projects */}
      <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
        <GlassCard>
          <div className="border-b border-gray-100 px-5 py-4">
            <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
              Current TBP Projects
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-3 px-5 py-3 transition-colors duration-200 hover:bg-gray-50"
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {project.title}
                  </p>
                  <p className="truncate text-xs text-gray-500">{project.category}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 px-5 py-3">
            <button className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-500">
              View all →
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* CARD 2: Collaboration Status */}
      <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
        <GlassCard className="px-5 py-5">
          <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
            Collaboration Status
          </h3>
          <div className="mt-3 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-gray-800">{collaborationStatus}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Open to strategic partnerships, research collaboration, and working group
            participation within the TBP global network.
          </p>
          <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98]">
            Propose Collaboration
          </button>
        </GlassCard>
      </motion.div>

      {/* CARD 3: Contact */}
      <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
        <GlassCard className="px-5 py-5">
          <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
            Contact
          </h3>
          <div className="mt-3 flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-gray-50">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                <MessageSquare className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm text-gray-700">Send Message</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-gray-50">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                <Mail className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm text-gray-700">Email</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-gray-50">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="text-sm text-gray-700">{location}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </aside>
  );
}
