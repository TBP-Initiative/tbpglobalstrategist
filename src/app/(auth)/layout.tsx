import Link from "next/link"
import { ArrowLeft, Globe } from "lucide-react"

export const metadata = {
  title: {
    default: "Authentication",
    template: "%s | TBP Global Strategists",
  },
  description: "Sign in or create your TBP Global Strategists account.",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-purple-950/30" />
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] h-[300px] w-[300px] rounded-full bg-cyan-500/5 blur-[80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-purple-600/10" />

        <div className="flex items-center justify-between relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/on-boarding-brief"
            className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 transition-all hover:bg-indigo-500/20 hover:border-indigo-500/50"
          >
            On-Boarding Brief
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TBP Global</h1>
              <p className="text-sm text-white/60">Strategists</p>
            </div>
          </div>

          <blockquote className="space-y-4">
            <p className="text-3xl font-bold leading-relaxed text-white/90">
              Join TBP as a Global Strategist for The Neo-Polar Neutrality Global System (NPNGS)
            </p>
            <p className="text-sm leading-[2] text-white/60 mt-8">
              The Borderless Project (TBP) is building a new global system for trade, energy, and cooperation — and we&apos;re looking for exceptional minds ready to co-create history.
            </p>
          </blockquote>

          <div className="flex gap-6 pt-4">
            {["Strategy", "Innovation", "Impact"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/30">
          &copy; {new Date().getFullYear()} TBP Global Strategists. All rights reserved.
        </p>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
