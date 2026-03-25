import { ROUTES } from '../src/navigation/routes';
import { getDocumentTitleForState } from '../src/navigation/webDocumentTitle';

describe('getDocumentTitleForState', () => {
  it('maps home route to a home title', () => {
    expect(
      getDocumentTitleForState({
        index: 0,
        routes: [{ name: ROUTES.HOME }],
      }),
    ).toBe('ADHD-CADDI | Home');
  });

  it('maps nested focus route to a focus title', () => {
    expect(
      getDocumentTitleForState({
        index: 0,
        routes: [
          {
            name: ROUTES.MAIN,
            state: {
              index: 1,
              routes: [{ name: ROUTES.HOME }, { name: ROUTES.FOCUS }],
            },
          },
        ],
      }),
    ).toBe('ADHD-CADDI | Focus');
  });

  it('maps brain dump route to a brain dump title', () => {
    expect(
      getDocumentTitleForState({
        index: 0,
        routes: [{ name: ROUTES.BRAIN_DUMP }],
      }),
    ).toBe('ADHD-CADDI | Brain Dump');
  });
});
