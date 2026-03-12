import { featureColors } from '../../theme/nightAwe/semantic';

export type NightAweFeatureKey = keyof typeof featureColors;

export type ConstellationNode = {
  id: NightAweFeatureKey;
  x: number;
  y: number;
};

export const NIGHT_AWE_CONSTELLATION_NODES: readonly ConstellationNode[] = [
  { id: 'home', x: 18, y: 58 },
  { id: 'tasks', x: 34, y: 34 },
  { id: 'brainDump', x: 48, y: 52 },
  { id: 'ignite', x: 62, y: 24 },
  { id: 'fogCutter', x: 78, y: 50 },
  { id: 'checkIn', x: 88, y: 68 },
] as const;

export const NIGHT_AWE_CONSTELLATION_EDGES: readonly [
  NightAweFeatureKey,
  NightAweFeatureKey,
][] = [
  ['home', 'tasks'],
  ['tasks', 'brainDump'],
  ['brainDump', 'ignite'],
  ['ignite', 'fogCutter'],
  ['fogCutter', 'checkIn'],
  ['brainDump', 'fogCutter'],
] as const;
