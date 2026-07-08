-- Add category field to StrategistProfile
ALTER TABLE "StrategistProfile" ADD COLUMN IF NOT EXISTS "category" TEXT;
