const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12)

  const users = [
    { name: "Admin User", email: "admin@tbp.global", role: "ADMIN" },
    { name: "Strategist User", email: "strategist@tbp.global", role: "STRATEGIST" },
    { name: "Corporate User", email: "corporate@tbp.global", role: "CORPORATE" },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        role: user.role,
        passwordHash,
      },
    })
    console.log(`Created ${user.role} user: ${user.email} (password: Password123!)`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
