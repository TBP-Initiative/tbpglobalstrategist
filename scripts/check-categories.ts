import { prisma } from "../src/lib/prisma"

async function main() {
  const projects = await prisma.project.findMany({
    where: { isFeatured: true },
    select: { id: true, title: true, category: true },
  })
  console.log(JSON.stringify(projects, null, 2))
}

main().then(() => prisma.$disconnect())
