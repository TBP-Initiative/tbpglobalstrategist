import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { readFileSync } from "fs"
import { join } from "path"

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) })

async function main() {
  console.log("Applying migration: ProgressionStage...")
  const sql = readFileSync(join(process.cwd(), "prisma/migrations/202507070001_progression_stage/migration.sql"), "utf-8")
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"))

  for (const stmt of statements) {
    try {
      await prisma.$executeRawUnsafe(stmt + ";")
      console.log(`✓ Executed: ${stmt.slice(0, 60)}...`)
    } catch (err) {
      console.log(`✗ Skipped (may already exist): ${stmt.slice(0, 60)}...`)
    }
  }

  console.log("Migration complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
