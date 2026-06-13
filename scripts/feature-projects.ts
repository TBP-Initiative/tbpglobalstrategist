import { prisma } from "../src/lib/prisma"

async function main() {
  const projects = await prisma.project.findMany({ take: 4, orderBy: { createdAt: "desc" } })
  for (let i = 0; i < projects.length; i++) {
    await prisma.project.update({
      where: { id: projects[i].id },
      data: { isFeatured: true, featuredAt: new Date(Date.now() - i * 86400000) },
    })
    console.log("Featured:", projects[i].title)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
