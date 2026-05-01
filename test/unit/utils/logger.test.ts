const flushAsyncWork = () => new Promise<void>((resolve) => setImmediate(resolve));
const stripAnsi = (message: string) => {
  const escape = String.fromCharCode(27);
  return message.replace(new RegExp(`${escape}\\[[0-9;]*m`, 'g'), '');
};

const loadLogger = () => {
  jest.unmock('../../../src/utils/logger');
  return (jest.requireActual('../../../src/utils/logger') as typeof import('../../../src/utils/logger')).logger;
};

describe('logger', () => {
  let logSpy: jest.SpiedFunction<typeof console.log>;
  let errorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows the logo when silent mode is disabled', () => {
    const logger = loadLogger();

    logger.showLogo();

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy.mock.calls[0][0]).toContain('_');
  });

  it('suppresses logo and tagged logs when silent mode is enabled', async () => {
    const logger = loadLogger();

    logger.setSilent(true);
    logger.showLogo();
    logger.log('CLI', 'hidden message');
    await flushAsyncWork();

    expect(logSpy).not.toHaveBeenCalled();
  });

  it.each([
    'CLI',
    'Server',
    'Livereload',
    'Announcement',
    'Other',
  ])('writes the padded tag for %s logs', async (tag) => {
    const logger = loadLogger();
    const prefix = ` ${tag.padEnd(12, ' ')} `;

    logger.log(tag as never, 'plain message');
    await flushAsyncWork();

    expect(stripAnsi(logSpy.mock.calls[0][0] as string)).toContain(`${prefix} plain message`);
  });

  it('formats URLs as clickable links and forwards extra arguments', async () => {
    const logger = loadLogger();
    const url = 'https://example.com/docs';
    const meta = { ok: true };

    logger.log('Announcement', `Open ${url}`, meta);
    await flushAsyncWork();

    expect(logSpy.mock.calls[0][0]).toContain('Announcement');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Open \x1b]8;;${url}\x1b\\${url}\x1b]8;;\x1b\\`),
      meta,
    );
  });

  it('writes styled errors to stderr', async () => {
    const logger = loadLogger();
    const detail = { code: 500 };

    logger.error('something failed', detail);
    await flushAsyncWork();

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error'), 'something failed', detail);
  });
});
