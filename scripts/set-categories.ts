import { prisma } from "../src/lib/prisma"

async function main() {
  const updates = [
    { title: "Customer Experience Transformation", category: "Software & Digital Platforms" },
    { title: "Risk Management Framework", category: "NPNGS Protocols" },
    { title: "Innovation Lab Setup", category: "Infrastructure Systems" },
    { title: "Data Platform Migration", category: "Software & Digital Platforms" },
  ]

  for (const u of updates) {
    const p = await prisma.project.findFirst({ where: { title: u.title, isFeatured: true } })
    if (p) {
      await prisma.project.update({ where: { id: p.id }, data: { category: u.category } })
      console.log(`Set "${p.title}" → ${u.category}`)
    }
  }
}

main().then(() => prisma.$disconnect())
