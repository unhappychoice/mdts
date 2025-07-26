jest.mock('../src/utils/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('simple-git');
