import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['warn'], errorFormat: 'pretty'
  })
} else {
  const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ['query', 'info', 'warn'], errorFormat: 'pretty'
    })
  }

  prisma = globalForPrisma.prisma
}

export { prisma }
