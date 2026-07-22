-- AlterTable: Add isActive field to User (default true for existing users)
ALTER TABLE "User" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
