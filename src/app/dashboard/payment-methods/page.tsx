"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { CreditCard, Plus, Trash2, CheckCircle, Building2, Loader2, DollarSign, Clock } from "lucide-react"

interface PaymentMethod {
  id: string
  type: string
  isDefault: boolean
  label: string | null
  paypalEmail: string | null
  accountHolder: string | null
  bankName: string | null
  accountNumber: string | null
  routingNumber: string | null
  swiftCode: string | null
  iban: string | null
  country: string | null
  createdAt: string
}

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState<"PAYPAL" | "BANK_TRANSFER">("PAYPAL")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [payoutHistory, setPayoutHistory] = useState<Array<{
    id: string; amount: number; method: string; status: string; transactionRef: string | null
    createdAt: string; processedAt: string | null; paidAt: string | null
    paymentMethod: { type: string; label: string | null; paypalEmail: string | null; accountHolder: string | null; bankName: string | null } | null
  }>>([])

  const [label, setLabel] = useState("")
  const [paypalEmail, setPaypalEmail] = useState("")
  const [accountHolder, setAccountHolder] = useState("")
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [routingNumber, setRoutingNumber] = useState("")
  const [swiftCode, setSwiftCode] = useState("")
  const [iban, setIban] = useState("")
  const [country, setCountry] = useState("")

  const fetchMethods = () => {
    fetch("/api/payment-methods")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setMethods(data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const fetchPayoutHistory = () => {
    fetch("/api/referrals/payout")
      .then((r) => r.json())
      .then((data) => { if (data?.payoutRequests) setPayoutHistory(data.payoutRequests) })
      .catch(console.error)
  }

  useEffect(() => { fetchMethods(); fetchPayoutHistory() }, [])

  const resetForm = () => {
    setLabel(""); setPaypalEmail(""); setAccountHolder(""); setBankName("")
    setAccountNumber(""); setRoutingNumber(""); setSwiftCode(""); setIban(""); setCountry("")
  }

  const handleSave = async () => {
    if (formType === "PAYPAL" && !paypalEmail.trim()) {
      toast.error("PayPal email is required")
      return
    }
    if (formType === "BANK_TRANSFER" && (!accountHolder.trim() || !accountNumber.trim())) {
      toast.error("Account holder and account number are required")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formType,
          label: label.trim() || null,
          paypalEmail: paypalEmail.trim() || null,
          accountHolder: accountHolder.trim() || null,
          bankName: bankName.trim() || null,
          accountNumber: accountNumber.trim() || null,
          routingNumber: routingNumber.trim() || null,
          swiftCode: swiftCode.trim() || null,
          iban: iban.trim() || null,
          country: country.trim() || null,
          isDefault: methods.length === 0,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to save")
      }
      toast.success("Payment method saved")
      resetForm()
      setShowForm(false)
      fetchMethods()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      const res = await fetch(`/api/payment-methods?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Payment method deleted")
        fetchMethods()
      }
    } finally {
      setDeleting(null)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await fetch("/api/payment-methods", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isDefault: true }),
      })
      fetchMethods()
    } catch {}
  }

  const maskAccount = (num: string) => {
    if (num.length <= 4) return num
    return "*".repeat(num.length - 4) + num.slice(-4)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-sm text-gray-500">Manage your payout details for referral commissions.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={14} />
          Add Method
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={formType === "PAYPAL" ? "default" : "outline"}
                size="sm"
                onClick={() => setFormType("PAYPAL")}
              >
                PayPal
              </Button>
              <Button
                variant={formType === "BANK_TRANSFER" ? "default" : "outline"}
                size="sm"
                onClick={() => setFormType("BANK_TRANSFER")}
              >
                Bank Transfer
              </Button>
            </div>

            <div>
              <Label className="text-xs">Label (optional)</Label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. My PayPal, Business Account" />
            </div>

            {formType === "PAYPAL" ? (
              <div>
                <Label className="text-xs">PayPal Email *</Label>
                <Input type="email" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} placeholder="your@email.com" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Account Holder *</Label>
                  <Input value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} placeholder="John Doe" />
                </div>
                <div>
                  <Label className="text-xs">Bank Name</Label>
                  <Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Chase, Wells Fargo, etc." />
                </div>
                <div>
                  <Label className="text-xs">Account Number *</Label>
                  <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="123456789" />
                </div>
                <div>
                  <Label className="text-xs">Routing Number</Label>
                  <Input value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value)} placeholder="021000021" />
                </div>
                <div>
                  <Label className="text-xs">SWIFT / BIC Code</Label>
                  <Input value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} placeholder="CHASUS33" />
                </div>
                <div>
                  <Label className="text-xs">IBAN</Label>
                  <Input value={iban} onChange={(e) => setIban(e.target.value)} placeholder="GB29NWBK60161331926819" />
                </div>
                <div>
                  <Label className="text-xs">Country</Label>
                  <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="US, UK, NG, etc." />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : "Save"}
              </Button>
              <Button variant="ghost" onClick={() => { setShowForm(false); resetForm() }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : methods.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <CreditCard size={32} className="mx-auto mb-3 text-gray-300" />
            <p>No payment methods saved yet.</p>
            <p className="text-xs text-gray-400">Add a payment method to receive referral payouts.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {methods.map((m) => (
            <Card key={m.id} className={m.isDefault ? "border-primary/30" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {m.type === "PAYPAL" ? (
                        <CreditCard size={20} className="text-blue-500" />
                      ) : (
                        <Building2 size={20} className="text-green-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{m.label || (m.type === "PAYPAL" ? "PayPal" : "Bank Transfer")}</p>
                        {m.isDefault && <Badge className="text-[10px]">Default</Badge>}
                      </div>
                      {m.type === "PAYPAL" ? (
                        <p className="text-sm text-gray-500">{m.paypalEmail}</p>
                      ) : (
                        <div className="space-y-0.5 text-sm text-gray-500">
                          <p>{m.accountHolder}{m.bankName ? ` — ${m.bankName}` : ""}</p>
                          <p className="font-mono text-xs">****{maskAccount(m.accountNumber || "")}</p>
                          {m.country && <p className="text-xs text-gray-400">{m.country}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!m.isDefault && (
                      <Button variant="ghost" size="sm" onClick={() => handleSetDefault(m.id)} className="text-xs">
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-400 hover:text-red-600"
                      onClick={() => handleDelete(m.id)}
                      disabled={deleting === m.id}
                    >
                      {deleting === m.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock size={18} className="text-gray-500" />
            Payout History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payoutHistory.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <DollarSign size={32} className="mx-auto mb-3 text-gray-300" />
              <p>No payout requests yet.</p>
              <p className="text-xs text-gray-400">Request a payout from your Referrals dashboard once your balance reaches $100.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-gray-500">
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Method</th>
                    <th className="pb-2">Payment Details</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Transaction Ref</th>
                    <th className="pb-2">Requested</th>
                    <th className="pb-2">Processed</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutHistory.map((p) => (
                    <tr key={p.id} className="border-b">
                      <td className="py-3 font-semibold">${p.amount}</td>
                      <td className="py-3">{p.method === "PAYPAL" ? "PayPal" : "Bank Transfer"}</td>
                      <td className="py-3">
                        {p.paymentMethod ? (
                          <div className="text-xs text-gray-500">
                            {p.paymentMethod.type === "PAYPAL" ? (
                              <span>{p.paymentMethod.paypalEmail}</span>
                            ) : (
                              <span>{p.paymentMethod.accountHolder}{p.paymentMethod.bankName ? ` — ${p.paymentMethod.bankName}` : ""}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3">
                        <Badge variant={p.status === "PAID" ? "default" : p.status === "PENDING" ? "secondary" : "destructive"}>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-3 font-mono text-xs text-gray-400">{p.transactionRef || "—"}</td>
                      <td className="py-3 text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 text-xs text-gray-500">
                        {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : p.processedAt ? new Date(p.processedAt).toLocaleDateString() : "—"}
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
