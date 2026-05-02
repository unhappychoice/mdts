describe('index', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('instantiates CLI and runs it', async () => {
    const run = jest.fn();
    const CLI = jest.fn(() => ({ run }));

    jest.doMock('../../src/cli', () => ({ CLI }));

    await import('../../src/index');

    expect(CLI).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledTimes(1);
  });
});
