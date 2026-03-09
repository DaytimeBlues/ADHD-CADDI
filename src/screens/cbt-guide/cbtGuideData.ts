export type CBTCategory = {
  id: string;
  title: string;
  emoji: string;
  pillar: string;
  description: string;
  features: { name: string; route: string }[];
};

export const buildCbtCategories = (): CBTCategory[] => [
  {
    id: 'activation',
    title: 'BEHAVIORAL ACTIVATION',
    emoji: '🎯',
    pillar: 'CADDI PILLAR 1',
    description:
      "Can't start? Feeling stuck? These tools help overcome initiation paralysis by taking small steps.",
    features: [
      { name: 'Ignite Timer', route: 'Focus' },
      { name: 'Pomodoro', route: 'Pomodoro' },
    ],
  },
  {
    id: 'organization',
    title: 'ORGANIZATION',
    emoji: '📋',
    pillar: 'CADDI PILLAR 2',
    description:
      'Overwhelmed by chaos? Break tasks down and externalize your working memory to reduce load.',
    features: [
      { name: 'Fog Cutter', route: 'FogCutter' },
      { name: 'Brain Dump', route: 'Tasks' },
    ],
  },
  {
    id: 'mindfulness',
    title: 'MINDFULNESS',
    emoji: '🧘',
    pillar: 'CADDI PILLAR 3',
    description:
      'Racing thoughts? Impulsive reactions? Build awareness and emotional regulation skills.',
    features: [{ name: 'Anchor Breathing', route: 'Anchor' }],
  },
  {
    id: 'tracking',
    title: 'SELF-TRACKING',
    emoji: '📊',
    pillar: 'CBT STRATEGY',
    description:
      'Recognize patterns in your mood, energy, and productivity over time to learn what works.',
    features: [
      { name: 'Daily Check In', route: 'CheckIn' },
      { name: 'Calendar', route: 'Calendar' },
    ],
  },
];
