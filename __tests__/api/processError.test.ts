import { prisma } from '@/lib/db';
import { NoticeError } from '@/lib/parseNotice';
import { processError } from '@/lib/processError';
import { describe, expect, test } from '@jest/globals';
import { execSync } from 'child_process';
import { createProject } from '../factories/prismaFactories';

beforeAll(async () => {
  execSync('npx prisma migrate reset --force --skip-seed');
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "project" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "notice" CASCADE;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "occurrence" CASCADE;');
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('processError', () => {
  test('updates', async () => {

    const project = await createProject(prisma);

    const errorData: NoticeError = {
      type: 'Error',
      message: 'Error: deadlock detected',
      backtrace: [],
    };

    const contextData = { environment: 'test' };
    const environmentData = {};
    const sessionData = {};
    const requestParamsData = {};

    // Run processError sequentially
    const sequentialRequests = 2;

    for (let i = 0; i < sequentialRequests; i++) {
      // console.log(`Running processError ${i + 1} of ${sequentialRequests}`);
      await expect(
        processError(
          prisma,
          project,
          errorData,
          contextData,
          environmentData,
          sessionData,
          requestParamsData
        )
      ).resolves.not.toThrow();
    }
  });

  // test('handles deadlocks', async () => {

  //   const project = await createProject(prisma);

  //   const errorData: NoticeError = {
  //     type: 'Error',
  //     message: 'Error: deadlock detected',
  //     backtrace: [],
  //   };

  //   const contextData = { environment: 'test' };
  //   const environmentData = {};
  //   const sessionData = {};
  //   const requestParamsData = {};

  //   // Run processError in parallel
  //   const parallelRequests = 14;
  //   const promises = [];

  //   for (let i = 0; i < parallelRequests; i++) {
  //     promises.push(
  //       processError(
  //         prisma,
  //         project,
  //         errorData,
  //         contextData,
  //         environmentData,
  //         sessionData,
  //         requestParamsData
  //       )
  //     );
  //   }

  //   await expect(Promise.all(promises)).resolves.not.toThrow();
  // });
});
