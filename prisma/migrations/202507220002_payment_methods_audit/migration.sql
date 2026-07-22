-- Migration: Payment methods and audit trail
-- Run this in Supabase SQL Editor

-- 1. Create PaymentMethod table
CREATE TABLE "PaymentMethod" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "label" TEXT,
  "paypalEmail" TEXT,
  "accountHolder" TEXT,
  "bankName" TEXT,
  "accountNumber" TEXT,
  "routingNumber" TEXT,
  "swiftCode" TEXT,
  "iban" TEXT,
  "country" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PaymentMethod_userId_idx" ON "PaymentMethod"("userId");
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 2. Add new columns to PayoutRequest
ALTER TABLE "PayoutRequest" ADD COLUMN "paymentMethodId" TEXT;
ALTER TABLE "PayoutRequest" ADD COLUMN "transactionRef" TEXT;
ALTER TABLE "PayoutRequest" ADD COLUMN "paidAt" TIMESTAMP(3);
ALTER TABLE "PayoutRequest" ADD COLUMN "processedById" TEXT;

ALTER TABLE "PayoutRequest" ADD CONSTRAINT "PayoutRequest_paymentMethodId_fkey"
  FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 3. Create PayoutAuditLog table
CREATE TABLE "PayoutAuditLog" (
  "id" TEXT NOT NULL,
  "payoutRequestId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "details" TEXT,
  "transactionRef" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PayoutAuditLog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PayoutAuditLog_payoutRequestId_idx" ON "PayoutAuditLog"("payoutRequestId");
CREATE INDEX "PayoutAuditLog_userId_idx" ON "PayoutAuditLog"("userId");
CREATE INDEX "PayoutAuditLog_action_idx" ON "PayoutAuditLog"("action");
ALTER TABLE "PayoutAuditLog" ADD CONSTRAINT "PayoutAuditLog_payoutRequestId_fkey"
  FOREIGN KEY ("payoutRequestId") REFERENCES "PayoutRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PayoutAuditLog" ADD CONSTRAINT "PayoutAuditLog_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
