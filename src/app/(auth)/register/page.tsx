"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refCode = searchParams.get("ref") || ""

  useEffect(() => {
    const destination = refCode ? `/onboarding?ref=${refCode}` : "/onboarding"
    router.replace(destination)
  }, [router, refCode])

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-white/60">
      <Loader2 className="h-6 w-6 animate-spin" />
      <p className="text-sm">Redirecting to onboarding...</p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8 text-white/60">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
