import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['<rootDir>/__tests__/api/**/*.test.ts', '<rootDir>/__tests__/lib/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/testSetup.ts'],
  maxWorkers: 1,
};

export default createJestConfig(config);
