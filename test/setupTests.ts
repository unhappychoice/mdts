jest.mock('../src/utils/logger', () => ({
  logger: {
    showLogo: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('simple-git');
