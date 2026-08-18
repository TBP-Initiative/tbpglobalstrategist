-- 1. See all projects with their current pathway
SELECT "id", "title", "eligiblePathways" FROM "Project" ORDER BY "createdAt" DESC;

-- 2. Assign Fellowship-only (example)
UPDATE "Project" SET "eligiblePathways" = 'FELLOWSHIP' WHERE "slug" = 'tbp-asmofp-modular-offshore-floating-platform-r-d';

-- 3. Assign Applied R&D only (example)
UPDATE "Project" SET "eligiblePathways" = 'APPLIED_RD' WHERE "slug" = 'tbp-capital-strategic-partnership-ai-data-engine';
