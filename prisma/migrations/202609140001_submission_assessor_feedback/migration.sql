-- AlterTable
ALTER TABLE "Submission" ADD COLUMN "assessorId" TEXT,
ADD COLUMN "assessorFeedback" TEXT,
ADD COLUMN "assessorNotes" TEXT;

-- CreateIndex
CREATE INDEX "Submission_assessorId_idx" ON "Submission"("assessorId");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assessorId_fkey" FOREIGN KEY ("assessorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;