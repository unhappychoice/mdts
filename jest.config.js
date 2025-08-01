module.exports = {
  projects: [
    {
      displayName: 'test',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/test/**/?(*.)+(spec|test).ts'],
      transformIgnorePatterns: ['node_modules'],
      setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],
    },
    "<rootDir>/jest-lint.config.js",
  ],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
}
