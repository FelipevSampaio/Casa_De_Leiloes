import { PrismaClient } from '@prisma/client';

const prismaGlobal = globalThis.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prismaGlobal;
}

export const prisma = prismaGlobal;
