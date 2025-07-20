module.exports = {
  projects: [
    {
      displayName: 'test',
      testMatch: ['<rootDir>/test/**/*.test.ts', '<rootDir>/test/**/*.test.tsx'],
      transform: {
        '^.+\.(t|j)sx?$': 'babel-jest',
      },
      transformIgnorePatterns: [
        '/node_modules/(?!mermaid)/',
      ],
      moduleNameMapper: {
        '\.(css|less)$': 'identity-obj-proxy',
        'react-syntax-highlighter': '<rootDir>/test/__mocks__/react-syntax-highlighter.tsx',
      },
      setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],
      testEnvironment: 'jsdom',
    },
    '<rootDir>/jest-lint.config.js',
  ],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '<rootDir>/src/**/*.tsx'],
};
