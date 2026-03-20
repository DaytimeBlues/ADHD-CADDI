import fs from 'fs';
import path from 'path';

describe('Firebase App Distribution helper', () => {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const helperPath = path.join(
    __dirname,
    '..',
    'scripts',
    'android',
    'distribute-firebase-app.js',
  );

  test('package scripts expose a Firebase App Distribution entrypoint', () => {
    const packageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, 'utf8'),
    ) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts).toHaveProperty(
      'distribute:android:firebase',
      'node scripts/android/distribute-firebase-app.js',
    );
  });

  test('distribution helper validates app id, testers, and default apk detection', () => {
    expect(fs.existsSync(helperPath)).toBe(true);

    const helper = jest.requireActual(helperPath) as {
      REQUIRED_ENV_VARS: string[];
      DEFAULT_PREVIEW_APK_RELATIVE_PATHS: string[];
      validateDistributionEnv: (env: NodeJS.ProcessEnv) => {
        ok: boolean;
        missing: string[];
      };
      buildDistributeArgs: (input: {
        apkPath: string;
        appId: string;
        testers: string;
        releaseNotes?: string;
      }) => string[];
    };

    expect(helper.REQUIRED_ENV_VARS).toEqual([
      'FIREBASE_APP_ID',
      'FIREBASE_TESTERS',
    ]);
    expect(helper.DEFAULT_PREVIEW_APK_RELATIVE_PATHS).toContain(
      'android/app/build/outputs/apk/preview/app-preview.apk',
    );
    expect(
      helper.validateDistributionEnv({
        FIREBASE_APP_ID: '1:123:android:abc',
        FIREBASE_TESTERS: '',
      } as unknown as NodeJS.ProcessEnv),
    ).toEqual({
      ok: false,
      missing: ['FIREBASE_TESTERS'],
    });
    expect(
      helper.buildDistributeArgs({
        apkPath: 'C:\\build\\app-preview.apk',
        appId: '1:123:android:abc',
        testers: 'friend@example.com',
        releaseNotes: 'Beta build',
      }),
    ).toEqual([
      'appdistribution:distribute',
      'C:\\build\\app-preview.apk',
      '--app',
      '1:123:android:abc',
      '--testers',
      'friend@example.com',
      '--release-notes',
      'Beta build',
    ]);
  });
});
