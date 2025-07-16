module.exports = {
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/test/**/*.test.{ts,tsx}',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\.(css|less|sass|scss)$': 'identity-obj-proxy',
    'react-markdown': '<rootDir>/src/__mocks__/react-markdown.tsx',
    'react-syntax-highlighter': '<rootDir>/src/__mocks__/react-syntax-highlighter.tsx',
    'rehype-raw': '<rootDir>/src/__mocks__/rehype-raw.tsx',
    'remark-gfm': '<rootDir>/src/__mocks__/remark-gfm.tsx',
    'remark-slug': '<rootDir>/src/__mocks__/remark-slug.tsx',
  },
  transform: {
    '^.+\.(ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@mui|@emotion)).+\.js$',
  ],
};