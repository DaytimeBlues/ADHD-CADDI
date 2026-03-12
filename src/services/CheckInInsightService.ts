import StorageService from './StorageService';
import { config } from '../config';
import { LoggerService } from './LoggerService';

export interface CheckInEntry {
  timestamp: number;
  mood?: number;
  energy?: number;
  symptoms?: string[];
}

export interface CheckInInsight {
  text: string;
  generatedAt: number;
}

type CheckInSummaryPayload = {
  totalCheckIns: number;
  averageMood: number | null;
  averageEnergy: number | null;
  lowestEnergy: number | null;
  highestEnergy: number | null;
  moodTrend: 'improving' | 'declining' | 'stable' | 'insufficient-data';
  energyTrend: 'improving' | 'declining' | 'stable' | 'insufficient-data';
  daysCovered: number;
};

const INSIGHT_CACHE_KEY = 'checkInInsightCache';
const INSIGHT_TTL_MS = 24 * 60 * 60 * 1000;
const CHECK_IN_HISTORY_KEY = StorageService.STORAGE_KEYS.checkInHistory;

const roundToSingleDecimal = (value: number): number =>
  Math.round(value * 10) / 10;

const getAverage = (values: number[]): number | null => {
  if (values.length === 0) {
    return null;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return roundToSingleDecimal(total / values.length);
};

const getTrend = (values: number[]): CheckInSummaryPayload['energyTrend'] => {
  if (values.length < 2) {
    return 'insufficient-data';
  }

  const delta = values[values.length - 1] - values[0];
  if (delta >= 1) {
    return 'improving';
  }
  if (delta <= -1) {
    return 'declining';
  }
  return 'stable';
};

const buildContext = (entries: CheckInEntry[]): CheckInSummaryPayload => {
  if (entries.length === 0) {
    return {
      totalCheckIns: 0,
      averageMood: null,
      averageEnergy: null,
      lowestEnergy: null,
      highestEnergy: null,
      moodTrend: 'insufficient-data',
      energyTrend: 'insufficient-data',
      daysCovered: 0,
    };
  }

  const recentEntries = [...entries]
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-7);
  const moodValues = recentEntries
    .map((entry) => entry.mood)
    .filter((value): value is number => typeof value === 'number');
  const energyValues = recentEntries
    .map((entry) => entry.energy)
    .filter((value): value is number => typeof value === 'number');
  const oldestTimestamp = recentEntries[0]?.timestamp ?? Date.now();
  const newestTimestamp =
    recentEntries[recentEntries.length - 1]?.timestamp ?? oldestTimestamp;
  const daysCovered = Math.max(
    1,
    Math.ceil((newestTimestamp - oldestTimestamp) / (24 * 60 * 60 * 1000)) + 1,
  );

  return {
    totalCheckIns: recentEntries.length,
    averageMood: getAverage(moodValues),
    averageEnergy: getAverage(energyValues),
    lowestEnergy: energyValues.length > 0 ? Math.min(...energyValues) : null,
    highestEnergy: energyValues.length > 0 ? Math.max(...energyValues) : null,
    moodTrend: getTrend(moodValues),
    energyTrend: getTrend(energyValues),
    daysCovered,
  };
};

const CheckInInsightService = {
  async generateInsight(
    entries: CheckInEntry[],
  ): Promise<CheckInInsight | null> {
    if (entries.length === 0) {
      return null;
    }

    const cached =
      await StorageService.getJSON<CheckInInsight>(INSIGHT_CACHE_KEY);
    if (cached && Date.now() - cached.generatedAt < INSIGHT_TTL_MS) {
      return cached;
    }

    const summary = buildContext(entries);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.aiTimeout);

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/insight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        return null;
      }

      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        return null;
      }

      if (
        !payload ||
        typeof payload !== 'object' ||
        typeof (payload as { insight?: unknown }).insight !== 'string'
      ) {
        return null;
      }

      const insight: CheckInInsight = {
        text: (payload as { insight: string }).insight.trim(),
        generatedAt: Date.now(),
      };

      await StorageService.setJSON(INSIGHT_CACHE_KEY, insight);
      return insight;
    } catch (err) {
      clearTimeout(timer);
      LoggerService.warn({
        service: 'CheckInInsightService',
        operation: 'generateInsight',
        message: 'CheckInInsight unavailable',
        error: err,
      });
      return null;
    }
  },

  async getPersonalizedInsight(): Promise<string | null> {
    const entries =
      (await StorageService.getJSON<CheckInEntry[]>(CHECK_IN_HISTORY_KEY)) ||
      [];
    if (entries.length === 0) {
      return null;
    }

    const result = await this.generateInsight(entries);
    return result?.text || null;
  },

  async invalidateCache(): Promise<void> {
    await StorageService.setJSON(INSIGHT_CACHE_KEY, null);
  },

  async recordCheckIn(entry: CheckInEntry): Promise<void> {
    const existingEntries =
      (await StorageService.getJSON<CheckInEntry[]>(CHECK_IN_HISTORY_KEY)) ||
      [];
    const nextEntries = [entry, ...existingEntries].slice(0, 30);
    await StorageService.setJSON(CHECK_IN_HISTORY_KEY, nextEntries);
    await this.invalidateCache();
  },
};

export default CheckInInsightService;
