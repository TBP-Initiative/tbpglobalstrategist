-- AlterTable
ALTER TABLE "User" ADD COLUMN "assessorId" TEXT;

-- CreateIndex
CREATE INDEX "User_assessorId_idx" ON "User"("assessorId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_assessorId_fkey" FOREIGN KEY ("assessorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
