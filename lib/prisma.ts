import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '@/generated/prisma/client'

declare global {
  var __grouhPrismaClient: PrismaClient | undefined
}

export function getPrisma(): PrismaClient {
  if (!globalThis.__grouhPrismaClient) {
    const connectionString =
      process.env.DATABASE_URL ?? process.env.DIRECT_URL

    if (!connectionString) {
      throw new Error(
        'Missing DATABASE_URL or DIRECT_URL environment variable.'
      )
    }

    globalThis.__grouhPrismaClient = new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
    })
  }

  return globalThis.__grouhPrismaClient
}