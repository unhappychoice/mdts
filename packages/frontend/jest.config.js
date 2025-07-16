export default {
  projects: [
    {
      displayName: 'test',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/test/**/*.test.ts', '<rootDir>/test/**/*.test.tsx'],
      transform: {
        '^.+\.(ts|tsx)$': 'babel-jest',
      },
      transformIgnorePatterns: [
        '/node_modules/(?!react-syntax-highlighter).+',
      ],
      moduleNameMapper: {
        '\.(css|less)$': 'identity-obj-proxy',
        'react-syntax-highlighter': '<rootDir>/test/__mocks__/react-syntax-highlighter.tsx',
      },
      setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],
    },
    '<rootDir>/jest-lint.config.js',
  ]
};
