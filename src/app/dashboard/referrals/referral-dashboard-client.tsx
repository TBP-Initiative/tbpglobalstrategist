"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Users, DollarSign, Gift, CheckCircle, Clock, ExternalLink } from "lucide-react"

interface ReferralData {
  referralCode: string
  referralLink: string
  totalReferrals: number
  completedReferrals: number
  totalEarned: number
  totalPending: number
  referrals: Array<{
    name: string
    email: string
    status: string
    joinedAt: string
  }>
}

export function ReferralDashboardClient() {
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch("/api/onboarding/referral")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const copyLink = () => {
    if (data?.referralLink) {
      navigator.clipboard.writeText(data.referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>
  if (!data) return <div className="p-8 text-center text-gray-500">Could not load referral data</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Referrals</h1>
        <p className="text-sm text-gray-500">Share your referral link and earn $50 for each friend who completes payment.</p>
      </div>

      {/* Referral Link Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
            <code className="flex-1 truncate text-sm">{data.referralLink}</code>
            <Button size="sm" variant="outline" onClick={copyLink}>
              {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
            </Button>
          </div>
          <div className="rounded-lg border bg-white p-3">
            <p className="text-xs text-gray-500">Your referral code:</p>
            <p className="font-mono text-lg font-bold">{data.referralCode}</p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="mx-auto h-6 w-6 text-blue-500" />
            <p className="mt-2 text-2xl font-bold">{data.totalReferrals}</p>
            <p className="text-xs text-gray-500">Total Referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="mx-auto h-6 w-6 text-green-500" />
            <p className="mt-2 text-2xl font-bold">{data.completedReferrals}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="mx-auto h-6 w-6 text-green-600" />
            <p className="mt-2 text-2xl font-bold">${data.totalEarned}</p>
            <p className="text-xs text-gray-500">Earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Gift className="mx-auto h-6 w-6 text-purple-500" />
            <p className="mt-2 text-2xl font-bold">${data.totalPending}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Referrals List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {data.referrals.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No referrals yet. Share your link to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.referrals.map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{r.name || r.email}</p>
                    <p className="text-xs text-gray-400">{r.email}</p>
                  </div>
                  <Badge variant={r.status === "COMPLETED" ? "default" : "secondary"}>
                    {r.status === "COMPLETED" ? "$50 earned" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
