import { buildCbtCategories } from '../src/screens/cbt-guide/cbtGuideData';

describe('cbtGuideData', () => {
  it('includes the expected ADHD support categories', () => {
    const categories = buildCbtCategories();

    expect(categories.map((category) => category.id)).toEqual([
      'activation',
      'organization',
      'mindfulness',
      'tracking',
    ]);
  });

  it('keeps the core feature routes available from the guide', () => {
    const categories = buildCbtCategories();
    const routes = categories.flatMap((category) =>
      category.features.map((feature) => feature.route),
    );

    expect(routes).toEqual(
      expect.arrayContaining([
        'Focus',
        'Pomodoro',
        'FogCutter',
        'Tasks',
        'Anchor',
        'CheckIn',
        'Calendar',
      ]),
    );
  });
});
