import CheckInInsightService from '../src/services/CheckInInsightService';
import StorageService from '../src/services/StorageService';

jest.mock('../src/services/StorageService', () => ({
  __esModule: true,
  default: {
    STORAGE_KEYS: {
      checkInHistory: 'checkInHistory',
    },
    getJSON: jest.fn(),
    setJSON: jest.fn().mockResolvedValue(true),
  },
}));

describe('CheckInInsightService', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns null when no entries provided', async () => {
    const result = await CheckInInsightService.generateInsight([]);
    expect(result).toBeNull();
  });

  it('returns cached insight when still fresh', async () => {
    (StorageService.getJSON as jest.Mock).mockResolvedValueOnce({
      text: 'cached insight',
      generatedAt: Date.now(),
    });

    const result = await CheckInInsightService.generateInsight([
      { timestamp: Date.now(), mood: 3, energy: 3 },
    ]);

    expect(result?.text).toBe('cached insight');
  });

  it('generates and caches insight from API response', async () => {
    (StorageService.getJSON as jest.Mock).mockResolvedValueOnce(null);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ insight: 'you are trending up' }),
    } as unknown as Response);

    const result = await CheckInInsightService.generateInsight([
      { timestamp: Date.now(), mood: 4, energy: 4 },
    ]);

    expect(result?.text).toBe('you are trending up');
    expect(StorageService.setJSON).toHaveBeenCalled();
  });

  it('reads personalized insight from the canonical storage key', async () => {
    (StorageService.getJSON as jest.Mock)
      .mockResolvedValueOnce([{ timestamp: Date.now(), mood: 4, energy: 3 }])
      .mockResolvedValueOnce(null);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ insight: 'steady trend' }),
    } as unknown as Response);

    const result = await CheckInInsightService.getPersonalizedInsight();

    expect(StorageService.getJSON).toHaveBeenNthCalledWith(
      1,
      StorageService.STORAGE_KEYS.checkInHistory,
    );
    expect(result).toBe('steady trend');
  });

  it('sends only anonymized summary data to the insight API', async () => {
    (StorageService.getJSON as jest.Mock).mockResolvedValueOnce(null);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ insight: 'summary ok' }),
    } as unknown as Response);

    await CheckInInsightService.generateInsight([
      { timestamp: 1, mood: 2, energy: 1 },
      { timestamp: 2, mood: 4, energy: 5 },
    ]);

    const request = (global.fetch as jest.Mock).mock.calls[0][1];
    const body = JSON.parse(request.body as string);

    expect(body.context).toBeUndefined();
    expect(body.summary).toEqual(
      expect.objectContaining({
        totalCheckIns: 2,
        averageMood: 3,
        averageEnergy: 3,
      }),
    );
  });

  it('records check-ins under the canonical history key and invalidates cache', async () => {
    (StorageService.getJSON as jest.Mock).mockResolvedValueOnce([
      { timestamp: 1, mood: 3, energy: 2 },
    ]);

    await CheckInInsightService.recordCheckIn({
      timestamp: 2,
      mood: 5,
      energy: 4,
    });

    expect(StorageService.setJSON).toHaveBeenNthCalledWith(
      1,
      StorageService.STORAGE_KEYS.checkInHistory,
      [
        { timestamp: 2, mood: 5, energy: 4 },
        { timestamp: 1, mood: 3, energy: 2 },
      ],
    );
    expect(StorageService.setJSON).toHaveBeenNthCalledWith(
      2,
      'checkInInsightCache',
      null,
    );
  });
});
