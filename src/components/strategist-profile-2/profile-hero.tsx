"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBio } from "@/lib/format-bio";

interface ProfileHeroProps {
  strategist: {
    name: string;
    headline: string;
    bio: string;
    avatar: string;
    isOnline: boolean;
    verified: boolean;
    role: string;
    expertiseTags: string[];
    location: string;
    city: string | null;
    country: string | null;
    countryCode: string | null;
    stats: {
      projectsCompleted: number;
      activeProjects: number;
      publications: number;
      networkSize: number;
    };
  };
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

export function ProfileHero({ strategist }: ProfileHeroProps) {
  const { name, headline, bio, avatar, isOnline, verified, role, expertiseTags, location, city, country, countryCode } =
    strategist;

  const [expanded, setExpanded] = useState(false)
  const isLong = bio.length > 400
  const displayBio = expanded || !isLong ? bio : bio.slice(0, 400).replace(/\s+\S*$/, "")

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-lg shadow-black/5">
      {/* Cover Image / Banner */}
      <div className="relative h-36 bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 md:h-40 lg:h-48">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url('/images/tbpgloblastrategist-coverbanner-img.webp')" }}
        />
      </div>

      {/* Content below cover */}
      <div className="px-6 pb-6 md:px-8 lg:px-10">
        {/* Avatar overlapping cover + Name/Headline/Location to the right */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="-mt-4 mb-4 flex items-end gap-4 md:-mt-6"
        >
          <div className="relative shrink-0">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-xl md:h-32 md:w-32 lg:h-36 lg:w-36">
              <img
                src={avatar}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>
            {isOnline && (
              <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-[3px] border-white bg-emerald-500 shadow-lg shadow-emerald-500/30" />
            )}
          </div>

          <div className="flex flex-col pb-1 md:pb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-gray-900 md:text-lg lg:text-xl">
                {name}
              </h1>
              {verified && (
                <BadgeCheck className="h-5 w-5" style={{ color: "#013466" }} aria-label="Verified" />
              )}
            </div>

            <span className="mt-1 inline-block w-fit rounded-full px-3 py-0.5 text-sm font-medium text-white ring-1 ring-white/30" style={{ backgroundColor: "#008540" }}>
              {role}
            </span>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-700">
              <p>{headline}</p>
              {(city || country || countryCode) && (
                <>
                  <span className="text-gray-400">·</span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    {countryCode && (
                      <img
                        src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
                        alt={country ?? ""}
                        className="h-3 w-[14px] rounded-sm object-cover"
                      />
                    )}
                    <span>{[city, country].filter(Boolean).join(", ") || location}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Bio + Expertise Tags */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-5 space-y-3 text-xs leading-relaxed text-gray-600 md:text-sm"
        >
          {expertiseTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {expertiseTags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p>{formatBio(displayBio)}</p>
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#013466] hover:underline"
            >
              {expanded ? "Show less" : "Read more"}
              <ChevronDown
                size={14}
                className={cn("transition-transform", expanded && "rotate-180")}
              />
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
