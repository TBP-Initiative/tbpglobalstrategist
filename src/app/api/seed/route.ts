import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const passwordHash = await bcrypt.hash("Password123!", 12)

    const users = [
      { name: "Admin User", email: "admin@tbp.global", role: "ADMIN" },
      { name: "Strategist User", email: "strategist@tbp.global", role: "STRATEGIST" },

    ]

    const results = []
    for (const user of users) {
      const u = await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          name: user.name,
          email: user.email,
          role: user.role,
          passwordHash,
        },
      })
      results.push({ email: u.email, role: u.role })
    }

    return Response.json({
      message: "Seed successful",
      users: results,
      note: "Password for all users is: Password123!",
    })
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 })
  }
}
