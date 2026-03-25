export type CheckInOption = {
  quote: string;
  author: string;
  label: string;
  value: number;
};

export const CHECK_IN_MOODS: CheckInOption[] = [
  {
    quote: '"I am a forest, and a night of dark trees."',
    author: 'Nietzsche',
    label: 'Low',
    value: 1,
  },
  {
    quote: '"A melancholy of mine own."',
    author: 'Shakespeare',
    label: 'Down',
    value: 2,
  },
  { quote: '"I simply am."', author: 'Kafka', label: 'Neutral', value: 3 },
  {
    quote: '"I celebrate myself, and sing myself."',
    author: 'Whitman',
    label: 'Good',
    value: 4,
  },
  {
    quote: '"I dwell in possibility."',
    author: 'Dickinson',
    label: 'Great',
    value: 5,
  },
];

export const CHECK_IN_ENERGY_LEVELS: CheckInOption[] = [
  {
    quote: '"I am worn out with dreams."',
    author: 'Wilde',
    label: 'Drained',
    value: 1,
  },
  {
    quote: '"A strange languor has come over me."',
    author: 'Shelley',
    label: 'Low',
    value: 2,
  },
  {
    quote: '"I am awake, and the world is awake."',
    author: 'Thoreau',
    label: 'Medium',
    value: 3,
  },
  {
    quote: '"There is a vitality, a life force."',
    author: 'Graham',
    label: 'High',
    value: 4,
  },
  {
    quote: '"I contain multitudes."',
    author: 'Whitman',
    label: 'Full',
    value: 5,
  },
];

export const getRecommendationCopy = (
  mood: number | null,
  energy: number | null,
) => {
  if (mood === null || energy === null) {
    return null;
  }

  if (mood <= 2 && energy <= 2) {
    return {
      title: 'GENTLE START',
      desc: 'Anchor can help you settle first, then decide on the next small move.',
    };
  }
  if (mood >= 4 && energy >= 4) {
    return {
      title: 'READY TO FOCUS',
      desc: 'This looks like a good moment for a short Ignite session.',
    };
  }
  if (energy <= 2) {
    return {
      title: 'MAKE IT SMALLER',
      desc: 'Fog Cutter can turn the task into one manageable first step.',
    };
  }

  return {
    title: 'BRAIN DUMP',
    desc: 'Capture what is bouncing around so the next step is easier to see.',
  };
};
