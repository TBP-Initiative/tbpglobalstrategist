"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { toast } from "sonner"
import { Copy, Users, DollarSign, Gift, CheckCircle, Clock, Wallet, ArrowRight, Loader2 } from "lucide-react"

interface ReferralData {
  referralCode: string
  referralLink: string
  totalReferrals: number
  completedReferrals: number
  pendingReferrals: number
  qualifiedReferrals: number
  approvedReferrals: number
  totalEarned: number
  totalPending: number
  totalApproved: number
  wallet: { availableBalance: number; paidBalance: number }
  referrals: Array<{
    name: string
    email: string
    status: string
    joinedAt: string
    credit: { amount: number; status: string; paidAt: string | null; approvedAt: string | null } | null
  }>
}

interface PayoutData {
  wallet: { availableBalance: number; paidBalance: number }
  minPayout: number
  payoutRequests: Array<{
    id: string
    amount: number
    method: string
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
  PENDING: { label: "In Hold (21 days)", color: "bg-yellow-100 text-yellow-600" },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-600" },
  PAID: { label: "Paid", color: "bg-emerald-100 text-emerald-600" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-600" },
}

export function ReferralDashboardClient() {
  const [data, setData] = useState<ReferralData | null>(null)
  const [payoutData, setPayoutData] = useState<PayoutData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showPayoutForm, setShowPayoutForm] = useState(false)
  const [payoutAmount, setPayoutAmount] = useState("")
  const [payoutMethod, setPayoutMethod] = useState("PAYPAL")
  const [payoutAccount, setPayoutAccount] = useState("")
  const [submittingPayout, setSubmittingPayout] = useState(false)

  const fetchData = () => {
    Promise.all([
      fetch("/api/onboarding/referral").then((r) => r.json()),
      fetch("/api/referrals/payout").then((r) => r.json()),
    ])
      .then(([ref, payout]) => {
        if (ref.referralCode) setData(ref)
        setPayoutData(payout)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const copyLink = () => {
    if (data?.referralLink) {
      navigator.clipboard.writeText(data.referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const requestPayout = async () => {
    const amt = parseFloat(payoutAmount)
    if (!amt || !payoutAccount.trim()) {
      toast.error("Please enter amount and account details")
      return
    }
    if (payoutData && amt < payoutData.minPayout) {
      toast.error(`Minimum payout is $${payoutData.minPayout}`)
      return
    }
    setSubmittingPayout(true)
    try {
      const res = await fetch("/api/referrals/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt, method: payoutMethod, accountDetails: payoutAccount.trim() }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Payout failed")
      toast.success("Payout request submitted!")
      setPayoutAmount("")
      setPayoutAccount("")
      setShowPayoutForm(false)
      fetchData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payout failed")
    } finally {
      setSubmittingPayout(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>
  if (!data) return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Referrals</h1>
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          <p>No referral code found. Complete onboarding to get your referral link.</p>
        </CardContent>
      </Card>
    </div>
  )

  const wallet = payoutData?.wallet || data.wallet
  const canPayout = wallet.availableBalance >= (payoutData?.minPayout || 100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Referrals</h1>
        <p className="text-sm text-gray-500">Share your referral link. Earn $50 for each referral who completes payment.</p>
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

      {/* Wallet Card */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet size={18} className="text-green-600" />
            Referral Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-white p-4 text-center">
              <p className="text-xs text-gray-500">Available Balance</p>
              <p className="mt-1 text-2xl font-bold text-green-600">${wallet.availableBalance}</p>
            </div>
            <div className="rounded-lg border bg-white p-4 text-center">
              <p className="text-xs text-gray-500">Paid Out</p>
              <p className="mt-1 text-2xl font-bold text-gray-700">${wallet.paidBalance}</p>
            </div>
            <div className="rounded-lg border bg-white p-4 text-center">
              <p className="text-xs text-gray-500">Total Earned</p>
              <p className="mt-1 text-2xl font-bold text-primary">${data.totalEarned}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button
              onClick={() => setShowPayoutForm(!showPayoutForm)}
              disabled={!canPayout}
              className="gap-2"
            >
              <ArrowRight size={14} />
              Request Payout
            </Button>
            {!canPayout && (
              <p className="text-xs text-gray-500">Minimum payout: ${payoutData?.minPayout || 100}</p>
            )}
          </div>

          {showPayoutForm && (
            <div className="mt-4 rounded-lg border bg-white p-4 space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Amount ($)</Label>
                  <Input
                    type="number"
                    min={payoutData?.minPayout || 100}
                    max={wallet.availableBalance}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder={`${payoutData?.minPayout || 100} - ${wallet.availableBalance}`}
                  />
                </div>
                <div>
                  <Label className="text-xs">Payment Method</Label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  >
                    <option value="PAYPAL">PayPal</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-xs">
                  {payoutMethod === "PAYPAL" ? "PayPal Email" : "Bank Account Details (name, account, routing)"}
                </Label>
                <Input
                  value={payoutAccount}
                  onChange={(e) => setPayoutAccount(e.target.value)}
                  placeholder={payoutMethod === "PAYPAL" ? "your@email.com" : "Account holder, Account #, Routing #"}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={requestPayout} disabled={submittingPayout} size="sm">
                  {submittingPayout ? <Loader2 size={14} className="animate-spin" /> : "Submit Request"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowPayoutForm(false)}>Cancel</Button>
              </div>
            </div>
          )}
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
            <p className="text-xs text-gray-500">Payment Received</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="mx-auto h-6 w-6 text-yellow-500" />
            <p className="mt-2 text-2xl font-bold">{data.pendingReferrals}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="mx-auto h-6 w-6 text-emerald-500" />
            <p className="mt-2 text-2xl font-bold">{data.approvedReferrals}</p>
            <p className="text-xs text-gray-500">Approved</p>
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-gray-500">
                    <th className="pb-2">Referred User</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Reward</th>
                    <th className="pb-2">Payment</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.referrals.map((r, i) => {
                    const s = statusLabels[r.status] || statusLabels.PENDING_REGISTRATION
                    const cs = r.credit ? creditStatusLabels[r.credit.status] : null
                    return (
                      <tr key={i} className="border-b">
                        <td className="py-3">
                          <p className="font-medium">{r.name || r.email}</p>
                          <p className="text-xs text-gray-400">{r.email}</p>
                        </td>
                        <td className="py-3">
                          <Badge className={`${s.color} border-0`}>{s.label}</Badge>
                        </td>
                        <td className="py-3">
                          {r.credit ? (
                            <span className="font-semibold">${r.credit.amount}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-3">
                          {cs ? (
                            <div>
                              <Badge className={`${cs.color} border-0`}>{cs.label}</Badge>
                              {r.credit?.paidAt && (
                                <p className="mt-0.5 text-[10px] text-gray-400">
                                  Paid {new Date(r.credit.paidAt).toLocaleDateString()}
                                </p>
                              )}
                              {r.credit?.approvedAt && (
                                <p className="mt-0.5 text-[10px] text-gray-400">
                                  Approved {new Date(r.credit.approvedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-3 text-xs text-gray-500">
                          {new Date(r.joinedAt).toLocaleDateString()}
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

      {/* Payout History */}
      {payoutData && payoutData.payoutRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-gray-500">
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Method</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Requested</th>
                    <th className="pb-2">Processed</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutData.payoutRequests.map((p) => (
                    <tr key={p.id} className="border-b">
                      <td className="py-3 font-semibold">${p.amount}</td>
                      <td className="py-3">{p.method === "PAYPAL" ? "PayPal" : "Bank Transfer"}</td>
                      <td className="py-3">
                        <Badge variant={p.status === "PAID" ? "default" : p.status === "PENDING" ? "secondary" : "destructive"}>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 text-xs text-gray-500">
                        {p.processedAt ? new Date(p.processedAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
