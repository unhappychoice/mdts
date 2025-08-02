module.exports = {
  projects: [
    {
      displayName: 'test',
      testMatch: ['<rootDir>/test/**/*.test.ts', '<rootDir>/test/**/*.test.tsx'],
      transform: {
        '^.+\.(t|j)sx?$': 'babel-jest',
      },
      transformIgnorePatterns: [
<<<<<<< Updated upstream
        '/node_modules/(?!mermaid|@mui/x-tree-view)/',
||||||| Stash base
        '/node_modules/(?!mermaid)/',
=======
        '/node_modules/(?!mermaid|rehype-slug)/',
>>>>>>> Stashed changes
      ],
      moduleNameMapper: {
        '\.(css|less)$': 'identity-obj-proxy',
        'react-syntax-highlighter': '<rootDir>/test/__mocks__/react-syntax-highlighter.tsx',
        'mermaid': '<rootDir>/test/__mocks__/mermaid.tsx',
      },
      setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],
      testEnvironment: 'jsdom',
    },
    '<rootDir>/jest-lint.config.js',
  ],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '<rootDir>/src/**/*.tsx'],
};
