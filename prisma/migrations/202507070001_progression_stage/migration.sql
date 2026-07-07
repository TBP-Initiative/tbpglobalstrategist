-- Create ProgressionStage enum
DO $$ BEGIN
  CREATE TYPE "ProgressionStage" AS ENUM ('CANDIDATE', 'STRATEGIST', 'CONTRIBUTOR', 'PROJECT_ALIGNED', 'SECTOR_LEAD', 'PAID_ADVISER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add stage and sector columns to StrategistProfile
ALTER TABLE "StrategistProfile" ADD COLUMN IF NOT EXISTS "stage" "ProgressionStage" NOT NULL DEFAULT 'CANDIDATE';
ALTER TABLE "StrategistProfile" ADD COLUMN IF NOT EXISTS "sector" TEXT;
