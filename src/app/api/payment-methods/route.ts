import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const methods = await prisma.paymentMethod.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    })

    return NextResponse.json(methods)
  } catch (err) {
    console.error("GET /api/payment-methods error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { type, label, paypalEmail, accountHolder, bankName, accountNumber, routingNumber, swiftCode, iban, country, isDefault } = body

    if (!type || !["BANK_TRANSFER", "PAYPAL"].includes(type)) {
      return NextResponse.json({ error: "Invalid payment method type" }, { status: 400 })
    }

    if (type === "PAYPAL" && !paypalEmail) {
      return NextResponse.json({ error: "PayPal email is required" }, { status: 400 })
    }

    if (type === "BANK_TRANSFER" && (!accountHolder || !accountNumber)) {
      return NextResponse.json({ error: "Account holder and account number are required" }, { status: 400 })
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    const method = await prisma.paymentMethod.create({
      data: {
        userId: session.user.id,
        type,
        isDefault: isDefault || false,
        label: label || null,
        paypalEmail: paypalEmail || null,
        accountHolder: accountHolder || null,
        bankName: bankName || null,
        accountNumber: accountNumber || null,
        routingNumber: routingNumber || null,
        swiftCode: swiftCode || null,
        iban: iban || null,
        country: country || null,
      },
    })

    return NextResponse.json(method, { status: 201 })
  } catch (err) {
    console.error("POST /api/payment-methods error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { id, isDefault, label } = body

    if (!id) {
      return NextResponse.json({ error: "Missing method ID" }, { status: 400 })
    }

    const existing = await prisma.paymentMethod.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    const updated = await prisma.paymentMethod.update({
      where: { id },
      data: {
        isDefault: isDefault ?? existing.isDefault,
        label: label !== undefined ? label : existing.label,
      },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error("PATCH /api/payment-methods error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing method ID" }, { status: 400 })
    }

    const existing = await prisma.paymentMethod.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.paymentMethod.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE /api/payment-methods error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
