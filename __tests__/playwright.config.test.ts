describe('playwright.config', () => {
  it('uses the default local base URL and starts a local web server when no override is set', () => {
    delete process.env.PLAYWRIGHT_BASE_URL;

    const config = require('../playwright.config').default;

    expect(config.use?.baseURL).toBe('http://localhost:3000');
    expect(config.webServer).toMatchObject({
      command: 'npm run web',
      url: 'http://localhost:3000',
      timeout: 300000,
    });
  });
});
