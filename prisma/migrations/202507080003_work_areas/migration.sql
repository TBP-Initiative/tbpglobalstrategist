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

-- Seed default work areas
INSERT INTO "WorkArea" ("id", "name", "slug", "createdAt", "updatedAt") VALUES
  (gen_random_uuid()::text, 'Capital Advisory', 'capital-advisory', NOW(), NOW()),
  (gen_random_uuid()::text, 'Engineering', 'engineering', NOW(), NOW()),
  (gen_random_uuid()::text, 'Architecture', 'architecture', NOW(), NOW()),
  (gen_random_uuid()::text, 'AI Automation', 'ai-automation', NOW(), NOW()),
  (gen_random_uuid()::text, 'Software Development', 'software-development', NOW(), NOW()),
  (gen_random_uuid()::text, 'Energy', 'energy', NOW(), NOW()),
  (gen_random_uuid()::text, 'Maritime', 'maritime', NOW(), NOW()),
  (gen_random_uuid()::text, 'Logistics', 'logistics', NOW(), NOW()),
  (gen_random_uuid()::text, 'Policy', 'policy', NOW(), NOW()),
  (gen_random_uuid()::text, 'Communications', 'communications', NOW(), NOW()),
  (gen_random_uuid()::text, 'Regional Development', 'regional-development', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;
