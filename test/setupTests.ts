import { logger } from '../src/utils/logger';

jest.mock('../src/utils/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
  },
}));
