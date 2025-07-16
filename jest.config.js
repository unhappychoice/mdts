export default {
  projects: [
    {
      displayName: 'server',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/test/unit/**/?(*.)+(spec|test).ts'],
      transformIgnorePatterns: ['node_modules'],
    },
    '<rootDir>/packages/frontend/jest.config.js',
    {
      displayName: 'e2e',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/test/e2e/?(*.)+(spec|test).ts'],
      transformIgnorePatterns: ['node_modules'],
    },
  ],
}
