import { prisma } from '@/lib/db';
import { execSync } from 'child_process';

beforeAll(async () => {
  execSync('npx prisma migrate reset --force --skip-seed');
  await prisma.$disconnect();
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "projects" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "notices" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "occurrences" CASCADE;');
});

afterAll(async () => {
  await prisma.$disconnect();
});

export default prisma;
