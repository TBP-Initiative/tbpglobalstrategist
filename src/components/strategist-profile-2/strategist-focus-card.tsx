"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StrategistFocusCardProps {
  focus: {
    strategicDomain: string
    primaryContribution: string
    currentTbpFocus: string
    collaborationStatus: string
    memberSince: string
    basedIn: string
    workAreas?: string[]
  }
}

const rows: { label: string; key: keyof StrategistFocusCardProps["focus"] }[] = [
  { label: "Strategic Domain", key: "strategicDomain" },
  { label: "Primary Contribution", key: "primaryContribution" },
  { label: "Current TBP Focus", key: "currentTbpFocus" },
  { label: "Work Areas", key: "workAreas" },
  { label: "Collaboration Status", key: "collaborationStatus" },
  { label: "Member Since", key: "memberSince" },
  { label: "Based In", key: "basedIn" },
];

const cardVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 + i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

export function StrategistFocusCard({ focus }: StrategistFocusCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border border-gray-200 bg-white shadow-lg shadow-black/5"
    >
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
          Strategist Focus
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        {rows.map((row, i) => (
          <motion.div
            key={row.key}
            custom={i}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            className={cn(
              "flex items-start justify-between gap-4 px-5 py-3 transition-colors duration-200",
              "hover:bg-gray-50",
              row.key === "currentTbpFocus" && "flex-col w-[90%]"
            )}
          >
            <span className="shrink-0 text-sm font-medium text-gray-500">
              {row.label}
            </span>
            {row.key === "workAreas" && Array.isArray(focus.workAreas) ? (
              <div className="flex flex-wrap gap-1.5 justify-end">
                {focus.workAreas.length > 0 ? (
                  focus.workAreas.map((area) => (
                    <span
                      key={area}
                      className="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-600"
                    >
                      {area}
                    </span>
                  ))
                ) : (
                  <span className="text-right text-xs text-gray-400">None assigned</span>
                )}
              </div>
            ) : (
              <span className="text-right text-sm text-gray-800 w-full text-wrap">
                {typeof focus[row.key] === "string" ? focus[row.key] as string : ""}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
