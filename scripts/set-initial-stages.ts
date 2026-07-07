import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) })

async function main() {
  console.log("Setting initial progression stages for existing strategists...")

  const profiles = await prisma.strategistProfile.findMany({
    include: { user: { select: { name: true } } },
  })

  for (const profile of profiles) {
    const title = profile.title?.toLowerCase() ?? ""
    let stage: string

    if (["senior strategist", "lead strategist", "head of strategy", "director of strategy"].some((t) => title.includes(t))) {
      stage = "CONTRIBUTOR"
    } else if (["strategist", "analyst", "consultant"].some((t) => title.includes(t))) {
      stage = "STRATEGIST"
    } else {
      stage = "CANDIDATE"
    }

    await prisma.strategistProfile.update({
      where: { id: profile.id },
      data: { stage: stage as any },
    })

    console.log(`  ${profile.user.name || "Unknown"}: ${stage}`)
  }

  console.log(`\nUpdated ${profiles.length} profiles.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
