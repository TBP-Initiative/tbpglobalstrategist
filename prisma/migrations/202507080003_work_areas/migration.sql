-- CreateTable WorkArea
CREATE TABLE "WorkArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "WorkArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable UserWorkArea
CREATE TABLE "UserWorkArea" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workAreaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserWorkArea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkArea_name_key" ON "WorkArea"("name");
CREATE UNIQUE INDEX "WorkArea_slug_key" ON "WorkArea"("slug");
CREATE UNIQUE INDEX "UserWorkArea_userId_workAreaId_key" ON "UserWorkArea"("userId", "workAreaId");

-- AddForeignKey
ALTER TABLE "UserWorkArea" ADD CONSTRAINT "UserWorkArea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserWorkArea" ADD CONSTRAINT "UserWorkArea_workAreaId_fkey" FOREIGN KEY ("workAreaId") REFERENCES "WorkArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed default work areas (uses md5-based UUID for portability)
INSERT INTO "WorkArea" ("id", "name", "slug", "createdAt", "updatedAt") VALUES
  (md5('Capital Advisory' || random()::text), 'Capital Advisory', 'capital-advisory', NOW(), NOW()),
  (md5('Engineering' || random()::text), 'Engineering', 'engineering', NOW(), NOW()),
  (md5('Architecture' || random()::text), 'Architecture', 'architecture', NOW(), NOW()),
  (md5('AI Automation' || random()::text), 'AI Automation', 'ai-automation', NOW(), NOW()),
  (md5('Software Development' || random()::text), 'Software Development', 'software-development', NOW(), NOW()),
  (md5('Energy' || random()::text), 'Energy', 'energy', NOW(), NOW()),
  (md5('Maritime' || random()::text), 'Maritime', 'maritime', NOW(), NOW()),
  (md5('Logistics' || random()::text), 'Logistics', 'logistics', NOW(), NOW()),
  (md5('Policy' || random()::text), 'Policy', 'policy', NOW(), NOW()),
  (md5('Communications' || random()::text), 'Communications', 'communications', NOW(), NOW()),
  (md5('Regional Development' || random()::text), 'Regional Development', 'regional-development', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;
