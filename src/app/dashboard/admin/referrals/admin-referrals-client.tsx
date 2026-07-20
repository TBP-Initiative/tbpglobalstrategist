"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, Gift, Clock, CheckCircle } from "lucide-react"

interface ReferralData {
  stats: {
    totalReferrals: number
    completedReferrals: number
    pendingReferrals: number
    totalPaidCredits: number
    totalPendingCredits: number
  }
  referrals: Array<{
    id: string
    referrerName: string
    referrerEmail: string
    referredName: string
    referredEmail: string
    status: string
    code: string
    createdAt: string
  }>
  credits: Array<{
    id: string
    userName: string
    userEmail: string
    amount: number
    status: string
    createdAt: string
  }>
}

export function AdminReferralsClient() {
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/referrals")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-center text-gray-500">Loading referrals...</div>
  if (!data) return <div className="p-8 text-center text-gray-500">Failed to load referrals</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Referral Management</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="mx-auto h-6 w-6 text-blue-500" />
            <p className="mt-2 text-2xl font-bold">{data.stats.totalReferrals}</p>
            <p className="text-xs text-gray-500">Total Referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="mx-auto h-6 w-6 text-green-500" />
            <p className="mt-2 text-2xl font-bold">{data.stats.completedReferrals}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="mx-auto h-6 w-6 text-amber-500" />
            <p className="mt-2 text-2xl font-bold">{data.stats.pendingReferrals}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="mx-auto h-6 w-6 text-green-600" />
            <p className="mt-2 text-2xl font-bold">${data.stats.totalPaidCredits}</p>
            <p className="text-xs text-gray-500">Paid Out</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Gift className="mx-auto h-6 w-6 text-purple-500" />
            <p className="mt-2 text-2xl font-bold">${data.stats.totalPendingCredits}</p>
            <p className="text-xs text-gray-500">Pending Payout</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {data.referrals.length === 0 ? (
            <p className="text-sm text-gray-500">No referrals yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-gray-500">
                    <th className="pb-2">Referrer</th>
                    <th className="pb-2">Referred User</th>
                    <th className="pb-2">Code</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.referrals.map((r) => (
                    <tr key={r.id} className="border-b">
                      <td className="py-3">
                        <p className="font-medium">{r.referrerName}</p>
                        <p className="text-xs text-gray-400">{r.referrerEmail}</p>
                      </td>
                      <td className="py-3">
                        <p className="font-medium">{r.referredName || "—"}</p>
                        <p className="text-xs text-gray-400">{r.referredEmail}</p>
                      </td>
                      <td className="py-3 font-mono text-xs">{r.code}</td>
                      <td className="py-3">
                        <Badge variant={r.status === "COMPLETED" ? "default" : "secondary"}>
                          {r.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-xs text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Credits</CardTitle>
        </CardHeader>
        <CardContent>
          {data.credits.length === 0 ? (
            <p className="text-sm text-gray-500">No credits yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-gray-500">
                    <th className="pb-2">User</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.credits.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="py-3">
                        <p className="font-medium">{c.userName}</p>
                        <p className="text-xs text-gray-400">{c.userEmail}</p>
                      </td>
                      <td className="py-3 font-semibold">${c.amount}</td>
                      <td className="py-3">
                        <Badge variant={c.status === "PAID" ? "default" : "secondary"}>
                          {c.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-xs text-gray-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
