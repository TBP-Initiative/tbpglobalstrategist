"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, DollarSign, Gift, Clock, CheckCircle, Loader2, KeyRound, Wallet, AlertTriangle } from "lucide-react"

interface ReferralData {
  stats: {
    totalReferrals: number
    completedReferrals: number
    pendingReferrals: number
    waitingApproval: number
    approvedReferrals: number
    totalPaidCredits: number
    totalPendingCredits: number
    totalApprovedCredits: number
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
    credit: { id: string; amount: number; status: string; paidAt: string | null; approvedAt: string | null } | null
  }>
  credits: Array<{
    id: string
    userName: string
    userEmail: string
    amount: number
    status: string
    createdAt: string
    paidAt: string | null
    approvedAt: string | null
  }>
  wallets: Array<{
    id: string
    userName: string
    userEmail: string
    availableBalance: number
    paidBalance: number
  }>
  payoutRequests: Array<{
    id: string
    userName: string
    userEmail: string
    amount: number
    method: string
    accountDetails: string
    status: string
    createdAt: string
    processedAt: string | null
  }>
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING_REGISTRATION: { label: "Pending Registration", color: "bg-gray-100 text-gray-600" },
  PAYMENT_RECEIVED: { label: "Payment Received", color: "bg-blue-100 text-blue-600" },
  WAITING_APPROVAL: { label: "Waiting Approval", color: "bg-yellow-100 text-yellow-600" },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-600" },
  PAID: { label: "Paid", color: "bg-emerald-100 text-emerald-600" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-600" },
}

const creditStatusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "In Hold", color: "bg-yellow-100 text-yellow-600" },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-600" },
  PAID: { label: "Paid", color: "bg-emerald-100 text-emerald-600" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-600" },
}

export function AdminReferralsClient() {
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const fetchData = () => {
    fetch("/api/admin/referrals")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const doAction = async (action: string, id: string) => {
    setActionLoading(id)
    try {
      const res = await fetch("/api/admin/referrals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, [action.includes("credit") ? "creditId" : "payoutRequestId"]: id }),
      })
      if (res.ok) fetchData()
      else { const e = await res.json(); alert(e.error || "Failed") }
    } finally { setActionLoading(null) }
  }

  const generateAllCodes = async () => {
    setGenerating(true)
    try {
      const res = await fetch("/api/admin/referrals/generate-codes", { method: "POST" })
      const result = await res.json()
      if (result.success) {
        alert(`Generated ${result.generated} referral codes for ${result.total} users.`)
        fetchData()
      }
    } catch { alert("Failed to generate codes") }
    finally { setGenerating(false) }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading referrals...</div>
  if (!data) return <div className="p-8 text-center text-gray-500">Failed to load referrals</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Referral Management</h1>
        <Button onClick={generateAllCodes} disabled={generating} variant="outline" className="gap-2">
          {generating ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
          Generate Missing Codes
        </Button>
      </div>

      {/* Stats */}
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
            <p className="text-xs text-gray-500">Payment Received</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="mx-auto h-6 w-6 text-yellow-500" />
            <p className="mt-2 text-2xl font-bold">{data.stats.waitingApproval}</p>
            <p className="text-xs text-gray-500">Waiting Approval</p>
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
            <p className="text-xs text-gray-500">Pending Hold</p>
          </CardContent>
        </Card>
      </div>

      {/* Payout Requests */}
      {data.payoutRequests.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle size={18} className="text-amber-500" />
              Payout Requests ({data.payoutRequests.filter((p) => p.status === "PENDING").length} pending)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-gray-500">
                    <th className="pb-2">User</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Method</th>
                    <th className="pb-2">Account</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.payoutRequests.map((p) => (
                    <tr key={p.id} className="border-b">
                      <td className="py-3">
                        <p className="font-medium">{p.userName}</p>
                        <p className="text-xs text-gray-400">{p.userEmail}</p>
                      </td>
                      <td className="py-3 font-semibold">${p.amount}</td>
                      <td className="py-3">{p.method === "PAYPAL" ? "PayPal" : "Bank Transfer"}</td>
                      <td className="py-3 text-xs text-gray-500 max-w-[200px] truncate">{p.accountDetails}</td>
                      <td className="py-3">
                        <Badge variant={p.status === "PAID" ? "default" : p.status === "PENDING" ? "secondary" : "destructive"}>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="py-3">
                        {p.status === "PENDING" && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => doAction("process-payout", p.id)} disabled={actionLoading === p.id} className="h-7 text-xs">
                              {actionLoading === p.id ? <Loader2 size={12} className="animate-spin" /> : "Approve"}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => doAction("reject-payout", p.id)} disabled={actionLoading === p.id} className="h-7 text-xs text-red-500">
                              Reject
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallets */}
      {data.wallets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet size={18} className="text-green-600" />
              Referral Wallets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-gray-500">
                    <th className="pb-2">User</th>
                    <th className="pb-2">Available</th>
                    <th className="pb-2">Paid Out</th>
                  </tr>
                </thead>
                <tbody>
                  {data.wallets.map((w) => (
                    <tr key={w.id} className="border-b">
                      <td className="py-3">
                        <p className="font-medium">{w.userName}</p>
                        <p className="text-xs text-gray-400">{w.userEmail}</p>
                      </td>
                      <td className="py-3 font-semibold text-green-600">${w.availableBalance}</td>
                      <td className="py-3 text-gray-500">${w.paidBalance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Referrals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Referrals</CardTitle>
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
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Reward</th>
                    <th className="pb-2">Credit Status</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.referrals.map((r) => {
                    const s = statusLabels[r.status] || statusLabels.PENDING_REGISTRATION
                    const cs = r.credit ? creditStatusLabels[r.credit.status] : null
                    return (
                      <tr key={r.id} className="border-b">
                        <td className="py-3">
                          <p className="font-medium">{r.referrerName}</p>
                          <p className="text-xs text-gray-400">{r.referrerEmail}</p>
                        </td>
                        <td className="py-3">
                          <p className="font-medium">{r.referredName || "—"}</p>
                          <p className="text-xs text-gray-400">{r.referredEmail}</p>
                        </td>
                        <td className="py-3">
                          <Badge className={`${s.color} border-0`}>{s.label}</Badge>
                        </td>
                        <td className="py-3">
                          {r.credit ? <span className="font-semibold">${r.credit.amount}</span> : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="py-3">
                          {cs ? (
                            <div>
                              <Badge className={`${cs.color} border-0`}>{cs.label}</Badge>
                              {r.credit?.approvedAt && (
                                <p className="mt-0.5 text-[10px] text-gray-400">Approved {new Date(r.credit.approvedAt).toLocaleDateString()}</p>
                              )}
                              {r.credit?.paidAt && (
                                <p className="mt-0.5 text-[10px] text-gray-400">Paid {new Date(r.credit.paidAt).toLocaleDateString()}</p>
                              )}
                            </div>
                          ) : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="py-3 text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td className="py-3">
                          {r.credit && (
                            <div className="flex gap-1">
                              {r.credit.status === "PENDING" && (
                                <Button size="sm" variant="outline" onClick={() => doAction("approve-credit", r.credit!.id)} disabled={actionLoading === r.credit!.id} className="h-7 text-xs">
                                  {actionLoading === r.credit!.id ? <Loader2 size={12} className="animate-spin" /> : "Approve"}
                                </Button>
                              )}
                              {r.credit.status === "APPROVED" && (
                                <Button size="sm" variant="outline" onClick={() => doAction("mark-paid", r.credit!.id)} disabled={actionLoading === r.credit!.id} className="h-7 text-xs">
                                  {actionLoading === r.credit!.id ? <Loader2 size={12} className="animate-spin" /> : "Mark Paid"}
                                </Button>
                              )}
                              {["PENDING", "APPROVED"].includes(r.credit.status) && (
                                <Button size="sm" variant="ghost" onClick={() => doAction("revert-credit", r.credit!.id)} disabled={actionLoading === r.credit!.id} className="h-7 text-xs text-gray-500">
                                  Revert
                                </Button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
