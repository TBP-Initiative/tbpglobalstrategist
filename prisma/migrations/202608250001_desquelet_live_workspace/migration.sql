-- CreateEnum
CREATE TYPE "DesqueletStage" AS ENUM ('D', 'E1', 'S', 'Q', 'U', 'E2', 'L', 'E3', 'T');

-- CreateEnum
CREATE TYPE "DesqueletReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REVISION_REQUIRED', 'FURTHER_EVIDENCE_REQUIRED');

-- CreateTable
CREATE TABLE "DesqueletRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "title" TEXT NOT NULL,
    "currentRevision" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesqueletRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesqueletStageContent" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "stage" "DesqueletStage" NOT NULL,
    "content" JSONB NOT NULL DEFAULT '{}',
    "percentageComplete" INTEGER NOT NULL DEFAULT 0,
    "lastEditedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesqueletStageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesqueletEvidence" (
    "id" TEXT NOT NULL,
    "stageContentId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER,
    "description" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesqueletEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesqueletIteration" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "fromStage" "DesqueletStage" NOT NULL,
    "toStage" "DesqueletStage" NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesqueletIteration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesqueletMilestone" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "reason" TEXT,
    "snapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesqueletMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesqueletReview" (
    "id" TEXT NOT NULL,
    "stageContentId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "status" "DesqueletReviewStatus" NOT NULL DEFAULT 'PENDING',
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesqueletReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DesqueletRecord_userId_projectId_key" ON "DesqueletRecord"("userId", "projectId");

-- CreateIndex
CREATE INDEX "DesqueletRecord_userId_idx" ON "DesqueletRecord"("userId");

-- CreateIndex
CREATE INDEX "DesqueletRecord_projectId_idx" ON "DesqueletRecord"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "DesqueletStageContent_recordId_stage_key" ON "DesqueletStageContent"("recordId", "stage");

-- CreateIndex
CREATE INDEX "DesqueletStageContent_recordId_idx" ON "DesqueletStageContent"("recordId");

-- CreateIndex
CREATE INDEX "DesqueletEvidence_stageContentId_idx" ON "DesqueletEvidence"("stageContentId");

-- CreateIndex
CREATE INDEX "DesqueletIteration_recordId_idx" ON "DesqueletIteration"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "DesqueletMilestone_recordId_version_key" ON "DesqueletMilestone"("recordId", "version");

-- CreateIndex
CREATE INDEX "DesqueletMilestone_recordId_idx" ON "DesqueletMilestone"("recordId");

-- CreateIndex
CREATE INDEX "DesqueletReview_stageContentId_idx" ON "DesqueletReview"("stageContentId");

-- CreateIndex
CREATE INDEX "DesqueletReview_reviewerId_idx" ON "DesqueletReview"("reviewerId");

-- AddForeignKey
ALTER TABLE "DesqueletRecord" ADD CONSTRAINT "DesqueletRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesqueletRecord" ADD CONSTRAINT "DesqueletRecord_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesqueletStageContent" ADD CONSTRAINT "DesqueletStageContent_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "DesqueletRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesqueletEvidence" ADD CONSTRAINT "DesqueletEvidence_stageContentId_fkey" FOREIGN KEY ("stageContentId") REFERENCES "DesqueletStageContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesqueletIteration" ADD CONSTRAINT "DesqueletIteration_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "DesqueletRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesqueletMilestone" ADD CONSTRAINT "DesqueletMilestone_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "DesqueletRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesqueletReview" ADD CONSTRAINT "DesqueletReview_stageContentId_fkey" FOREIGN KEY ("stageContentId") REFERENCES "DesqueletStageContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesqueletReview" ADD CONSTRAINT "DesqueletReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
