import { NoticeError } from '@/lib/parseNotice';
import { processError } from '@/lib/processError';
import { describe, expect, test } from '@jest/globals';
import { createProject } from '../factories/prismaFactories';

describe('processError', () => {
  test('updates', async () => {

    const project = await createProject();
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

  test('handles deadlocks', async () => {

    const project = await createProject();

    const errorData: NoticeError = {
      type: 'Error',
      message: 'Error: deadlock detected',
      backtrace: [],
    };

    const contextData = { environment: 'test' };
    const environmentData = {};
    const sessionData = {};
    const requestParamsData = {};

    // Run processError in parallel
    const parallelRequests = 5;
    const promises = [];

    for (let i = 0; i < parallelRequests; i++) {
      promises.push(
        processError(
          project,
          errorData,
          contextData,
          environmentData,
          sessionData,
          requestParamsData
        )
      );
    }

    await expect(Promise.all(promises)).resolves.not.toThrow();
  });
});
