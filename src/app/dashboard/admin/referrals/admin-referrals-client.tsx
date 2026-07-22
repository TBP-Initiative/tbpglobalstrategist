"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, DollarSign, Gift, Clock, CheckCircle, Loader2, KeyRound, Wallet, AlertTriangle, ChevronDown, ChevronUp, Search, Filter } from "lucide-react"

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
    transactionRef: string | null
    createdAt: string
    processedAt: string | null
    paidAt: string | null
    paymentMethod: { type: string; label: string | null; paypalEmail: string | null; accountHolder: string | null; bankName: string | null } | null
    auditLogs: Array<{
      id: string
      action: string
      details: string | null
      transactionRef: string | null
      userName: string
      userEmail: string
      createdAt: string
    }>
  }>
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING_REGISTRATION: { label: "Pending Registration", color: "bg-gray-100 text-gray-600" },
  WAITING_APPROVAL: { label: "In Hold (14 days)", color: "bg-yellow-100 text-yellow-600" },
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
  const [expandedPayout, setExpandedPayout] = useState<string | null>(null)
  const [transactionRef, setTransactionRef] = useState("")
  const [rejectReason, setRejectReason] = useState("")

  const [referralFilter, setReferralFilter] = useState("ALL")
  const [payoutFilter, setPayoutFilter] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  const fetchData = () => {
    fetch("/api/admin/referrals")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const doAction = async (action: string, id: string, extra?: Record<string, string>) => {
    setActionLoading(id)
    try {
      const res = await fetch("/api/admin/referrals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, [action.includes("credit") ? "creditId" : "payoutRequestId"]: id, ...extra }),
      })
      if (res.ok) { fetchData(); setTransactionRef(""); setRejectReason(""); setExpandedPayout(null) }
      else { const e = await res.json(); alert(e.error || "Failed") }
    } finally { setActionLoading(null) }
  }

  const generateAllCodes = async () => {
    setGenerating(true)
    try {
      const res = await fetch("/api/admin/referrals/generate-codes", { method: "POST" })
      const result = await res.json()
      if (result.success) { alert(`Generated ${result.generated} codes for ${result.total} users.`); fetchData() }
    } catch { alert("Failed") }
    finally { setGenerating(false) }
  }

  const filteredReferrals = useMemo(() => {
    if (!data) return []
    let list = data.referrals
    if (referralFilter !== "ALL") list = list.filter((r) => r.status === referralFilter)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter((r) => r.referrerName?.toLowerCase().includes(q) || r.referrerEmail?.toLowerCase().includes(q) || r.referredName?.toLowerCase().includes(q) || r.referredEmail?.toLowerCase().includes(q))
    }
    return list
  }, [data, referralFilter, searchQuery])

  const filteredPayouts = useMemo(() => {
    if (!data) return []
    let list = data.payoutRequests
    if (payoutFilter !== "ALL") list = list.filter((p) => p.status === payoutFilter)
    return list
  }, [data, payoutFilter])

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
            <Clock className="mx-auto h-6 w-6 text-yellow-500" />
            <p className="mt-2 text-2xl font-bold">{data.stats.waitingApproval}</p>
            <p className="text-xs text-gray-500">In Hold</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="mx-auto h-6 w-6 text-green-500" />
            <p className="mt-2 text-2xl font-bold">{data.stats.approvedReferrals}</p>
            <p className="text-xs text-gray-500">Approved</p>
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

      {/* Payout Queue */}
      <Card className="border-amber-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle size={18} className="text-amber-500" />
              Payout Queue ({filteredPayouts.filter((p) => p.status === "PENDING").length} pending)
            </CardTitle>
            <div className="flex gap-2">
              {["ALL", "PENDING", "PAID", "REJECTED"].map((f) => (
                <Button key={f} size="sm" variant={payoutFilter === f ? "default" : "outline"} onClick={() => setPayoutFilter(f)} className="h-7 text-xs">
                  {f}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPayouts.length === 0 ? (
            <p className="text-sm text-gray-500">No payout requests</p>
          ) : (
            <div className="space-y-3">
              {filteredPayouts.map((p) => {
                const isExpanded = expandedPayout === p.id
                return (
                  <div key={p.id} className="rounded-lg border">
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{p.userName}</p>
                          <p className="text-xs text-gray-400">{p.userEmail}</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-lg">${p.amount}</p>
                          <p className="text-[10px] text-gray-400">{p.method === "PAYPAL" ? "PayPal" : "Bank Transfer"}</p>
                        </div>
                        <div>
                          {p.paymentMethod && (
                            <div className="text-xs text-gray-500">
                              {p.paymentMethod.type === "PAYPAL" ? (
                                <span>PayPal: {p.paymentMethod.paypalEmail}</span>
                              ) : (
                                <span>{p.paymentMethod.accountHolder}{p.paymentMethod.bankName ? ` — ${p.paymentMethod.bankName}` : ""}</span>
                              )}
                            </div>
                          )}
                          {p.transactionRef && (
                            <p className="text-[10px] font-mono text-gray-400">Ref: {p.transactionRef}</p>
                          )}
                        </div>
                        <Badge variant={p.status === "PAID" ? "default" : p.status === "PENDING" ? "secondary" : "destructive"}>
                          {p.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpandedPayout(isExpanded ? null : p.id)}>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t p-4 space-y-4">
                        {/* Payment Details */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 mb-2">Payment Details</h4>
                          {p.paymentMethod ? (
                            <div className="rounded bg-gray-50 p-3 text-sm space-y-1">
                              <p><span className="text-gray-400">Type:</span> {p.paymentMethod.type === "PAYPAL" ? "PayPal" : "Bank Transfer"}</p>
                              {p.paymentMethod.label && <p><span className="text-gray-400">Label:</span> {p.paymentMethod.label}</p>}
                              {p.paymentMethod.paypalEmail && <p><span className="text-gray-400">Email:</span> {p.paymentMethod.paypalEmail}</p>}
                              {p.paymentMethod.accountHolder && <p><span className="text-gray-400">Account Holder:</span> {p.paymentMethod.accountHolder}</p>}
                              {p.paymentMethod.bankName && <p><span className="text-gray-400">Bank:</span> {p.paymentMethod.bankName}</p>}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400">Legacy payout — no saved payment method</p>
                          )}
                        </div>

                        {/* Audit Trail */}
                        {p.auditLogs.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 mb-2">Audit Trail</h4>
                            <div className="space-y-1">
                              {p.auditLogs.map((log) => (
                                <div key={log.id} className="flex items-center gap-2 text-xs text-gray-500">
                                  <Badge variant="outline" className="text-[10px] py-0">{log.action}</Badge>
                                  <span>{log.userName}</span>
                                  <span className="text-gray-400">{new Date(log.createdAt).toLocaleString()}</span>
                                  {log.transactionRef && <span className="font-mono text-gray-400">Ref: {log.transactionRef}</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        {p.status === "PENDING" && (
                          <div className="flex flex-wrap items-end gap-3">
                            <div>
                              <Label className="text-xs">Transaction Reference (optional)</Label>
                              <Input value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} placeholder="e.g. PAYPAL-12345" className="h-8 w-48 text-xs" />
                            </div>
                            <Button size="sm" onClick={() => doAction("process-payout", p.id, { transactionRef })} disabled={actionLoading === p.id} className="h-8">
                              {actionLoading === p.id ? <Loader2 size={12} className="animate-spin" /> : "Approve & Mark Paid"}
                            </Button>
                            <div>
                              <Input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Rejection reason (optional)" className="h-8 w-48 text-xs" />
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => doAction("reject-payout", p.id, { reason: rejectReason })} disabled={actionLoading === p.id} className="h-8 text-red-500">
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

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
                      <td className="py-3"><p className="font-medium">{w.userName}</p><p className="text-xs text-gray-400">{w.userEmail}</p></td>
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

      {/* All Referrals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">All Referrals</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="h-8 rounded-md border bg-transparent pl-7 pr-2 text-xs"
                />
              </div>
              {["ALL", "WAITING_APPROVAL", "APPROVED", "PAID", "PENDING_REGISTRATION", "CANCELLED"].map((f) => (
                <Button key={f} size="sm" variant={referralFilter === f ? "default" : "outline"} onClick={() => setReferralFilter(f)} className="h-7 text-[10px]">
                  {f === "ALL" ? "All" : (statusLabels[f]?.label || f)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredReferrals.length === 0 ? (
            <p className="text-sm text-gray-500">No referrals match filters</p>
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
                  {filteredReferrals.map((r) => {
                    const s = statusLabels[r.status] || statusLabels.PENDING_REGISTRATION
                    const cs = r.credit ? creditStatusLabels[r.credit.status] : null
                    return (
                      <tr key={r.id} className="border-b">
                        <td className="py-3"><p className="font-medium">{r.referrerName}</p><p className="text-xs text-gray-400">{r.referrerEmail}</p></td>
                        <td className="py-3"><p className="font-medium">{r.referredName || "—"}</p><p className="text-xs text-gray-400">{r.referredEmail}</p></td>
                        <td className="py-3"><Badge className={`${s.color} border-0`}>{s.label}</Badge></td>
                        <td className="py-3">{r.credit ? <span className="font-semibold">${r.credit.amount}</span> : <span className="text-gray-400">—</span>}</td>
                        <td className="py-3">
                          {cs ? (
                            <div>
                              <Badge className={`${cs.color} border-0`}>{cs.label}</Badge>
                              {r.credit?.approvedAt && <p className="mt-0.5 text-[10px] text-gray-400">Approved {new Date(r.credit.approvedAt).toLocaleDateString()}</p>}
                              {r.credit?.paidAt && <p className="mt-0.5 text-[10px] text-gray-400">Paid {new Date(r.credit.paidAt).toLocaleDateString()}</p>}
                            </div>
                          ) : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="py-3 text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td className="py-3">
                          {r.credit && (
                            <div className="flex gap-1">
                              {r.credit.status === "PENDING" && <span className="text-[10px] text-gray-400 italic">Auto in 21d</span>}
                              {r.credit.status === "APPROVED" && <Button size="sm" variant="outline" onClick={() => doAction("mark-paid", r.credit!.id)} disabled={actionLoading === r.credit!.id} className="h-7 text-xs">{actionLoading === r.credit!.id ? <Loader2 size={12} className="animate-spin" /> : "Mark Paid"}</Button>}
                              {["PENDING", "APPROVED"].includes(r.credit.status) && <Button size="sm" variant="ghost" onClick={() => doAction("revert-credit", r.credit!.id)} disabled={actionLoading === r.credit!.id} className="h-7 text-xs text-gray-500">Revert</Button>}
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
