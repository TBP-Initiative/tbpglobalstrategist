-- Migration: Referral workflow v2
-- Run this in Supabase SQL Editor

-- 1. Update existing referral statuses
UPDATE "Referral" SET "status" = 'PENDING_REGISTRATION' WHERE "status" = 'PENDING';
UPDATE "Referral" SET "status" = 'APPROVED' WHERE "status" = 'COMPLETED';
UPDATE "Referral" SET "status" = 'CANCELLED' WHERE "status" = 'EXPIRED';

-- 2. Update existing credit statuses
UPDATE "ReferralCredit" SET "status" = 'PENDING' WHERE "status" = 'PENDING';
UPDATE "ReferralCredit" SET "status" = 'APPROVED' WHERE "status" = 'PAID' AND "paidAt" IS NULL;
UPDATE "ReferralCredit" SET "status" = 'PAID' WHERE "status" = 'PAID' AND "paidAt" IS NOT NULL;

-- 3. Add approvedAt column to ReferralCredit
ALTER TABLE "ReferralCredit" ADD COLUMN "approvedAt" TIMESTAMP(3);

-- 4. Create ReferralWallet table
CREATE TABLE "ReferralWallet" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "availableBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
  "paidBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ReferralWallet_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ReferralWallet_userId_key" ON "ReferralWallet"("userId");

-- 5. Create PayoutRequest table
CREATE TABLE "PayoutRequest" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "amount" DECIMAL(65,30) NOT NULL,
  "method" TEXT NOT NULL,
  "accountDetails" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "processedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PayoutRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PayoutRequest_userId_idx" ON "PayoutRequest"("userId");
CREATE INDEX "PayoutRequest_status_idx" ON "PayoutRequest"("status");

-- 6. Add foreign keys
ALTER TABLE "ReferralWallet" ADD CONSTRAINT "ReferralWallet_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PayoutRequest" ADD CONSTRAINT "PayoutRequest_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
