import { fetchData } from '../../src/api';

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

const createResponse = ({
  ok = true,
  status = 200,
  json = undefined,
  text = '',
}: {
  ok?: boolean;
  status?: number;
  json?: unknown;
  text?: string;
}) => ({
  ok,
  status,
  json: jest.fn().mockResolvedValue(json),
  text: jest.fn().mockResolvedValue(text),
}) as unknown as Response;

describe('fetchData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns parsed json when responseType is json', async () => {
    const payload = { value: 'test' };
    mockFetch.mockResolvedValueOnce(createResponse({ json: payload }));

    await expect(fetchData<typeof payload>('/api/config', 'json')).resolves.toEqual(payload);
    expect(mockFetch).toHaveBeenCalledWith('/api/config');
  });

  it('returns text when responseType is text', async () => {
    mockFetch.mockResolvedValueOnce(createResponse({ text: 'diff content' }));

    await expect(fetchData<string>('/api/diff/test.md', 'text')).resolves.toBe('diff content');
  });

  it('logs and rethrows http errors', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockFetch.mockResolvedValueOnce(createResponse({ ok: false, status: 500 }));

    await expect(fetchData('/api/config', 'json')).rejects.toThrow('HTTP error! status: 500');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching from /api/config:',
      expect.any(Error),
    );
  });

  it('logs and rethrows fetch failures', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Network down');

    mockFetch.mockRejectedValueOnce(error);

    await expect(fetchData('/api/config', 'json')).rejects.toThrow(error);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching from /api/config:', error);
  });
});
