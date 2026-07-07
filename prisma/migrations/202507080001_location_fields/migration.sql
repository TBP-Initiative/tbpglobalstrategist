-- Add location fields to StrategistProfile
ALTER TABLE "StrategistProfile" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "StrategistProfile" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "StrategistProfile" ADD COLUMN IF NOT EXISTS "countryCode" TEXT;
