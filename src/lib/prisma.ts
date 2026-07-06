import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const databaseUrl = process.env.DATABASE_URL!;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter: new PrismaPg(databaseUrl) });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
