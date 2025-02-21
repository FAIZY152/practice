import { PrismaClient } from "@prisma/client";

declare global {
  interface Global {
    prisma?: PrismaClient;
  }
}

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const prismadb = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismadb;
}

export default prismadb;
