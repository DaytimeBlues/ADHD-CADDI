describe('firebase bootstrap', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.dontMock('react-native');
  });

  it('does not fall back to default auth on native bootstrap', () => {
    jest.doMock('react-native', () => {
      return {
        Platform: {
          OS: 'ios',
        },
      };
    });

    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    jest.isolateModules(() => {
      require('../src/services/firebase');
    });

    expect(consoleWarnSpy).not.toHaveBeenCalledWith(
      '[Firebase] Fallback auth initialization:',
      expect.anything(),
    );

    consoleWarnSpy.mockRestore();
  });
});
