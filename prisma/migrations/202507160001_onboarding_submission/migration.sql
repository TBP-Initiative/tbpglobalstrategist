-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('IN_PROGRESS', 'PENDING_PAYMENT', 'COMPLETED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "FellowshipPathway" AS ENUM ('STANDARD', 'PLUS');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'PAYPAL');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "OnboardingSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "OnboardingStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "fullName" TEXT,
    "preferredName" TEXT,
    "phoneNumber" TEXT,
    "city" TEXT,
    "country" TEXT,
    "linkedinUrl" TEXT,
    "currentStatus" TEXT,
    "pathway" "FellowshipPathway",
    "pathwayAmount" DECIMAL(10,2),
    "signatureName" TEXT,
    "agreedToTerms" BOOLEAN NOT NULL DEFAULT false,
    "agreedToConduct" BOOLEAN NOT NULL DEFAULT false,
    "agreedToIP" BOOLEAN NOT NULL DEFAULT false,
    "agreedToPrivacy" BOOLEAN NOT NULL DEFAULT false,
    "agreedToNoClaim" BOOLEAN NOT NULL DEFAULT false,
    "agreedToAccurate" BOOLEAN NOT NULL DEFAULT false,
    "agreedToRefund" BOOLEAN NOT NULL DEFAULT false,
    "paymentProvider" "PaymentProvider",
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentReference" TEXT,
    "paymentAmount" DECIMAL(10,2),
    "paymentCurrency" TEXT DEFAULT 'USD',
    "paidAt" TIMESTAMP(3),
    "profileVisibility" TEXT DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingSubmission_userId_key" ON "OnboardingSubmission"("userId");

-- CreateIndex
CREATE INDEX "OnboardingSubmission_status_idx" ON "OnboardingSubmission"("status");

-- AddForeignKey
ALTER TABLE "OnboardingSubmission" ADD CONSTRAINT "OnboardingSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
