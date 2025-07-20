module.exports = {
  projects: [
    {
      displayName: 'test',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/test/**/?(*.)+(spec|test).ts'],
      transformIgnorePatterns: ['node_modules'],
    },
    "<rootDir>/jest-lint.config.js",
  ],
}
