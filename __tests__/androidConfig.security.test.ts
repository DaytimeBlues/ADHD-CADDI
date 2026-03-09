import fs from 'fs';
import path from 'path';

const readRepoFile = (...segments: string[]) =>
  fs.readFileSync(path.join(__dirname, '..', ...segments), 'utf8');

describe('Android security config', () => {
  test('main manifest disables backups for the release app', () => {
    const manifest = readRepoFile(
      'android',
      'app',
      'src',
      'main',
      'AndroidManifest.xml',
    );

    expect(manifest).toContain('android:allowBackup="false"');
  });

  test('main manifest does not ship the debug cleartext network config', () => {
    const manifest = readRepoFile(
      'android',
      'app',
      'src',
      'main',
      'AndroidManifest.xml',
    );

    expect(manifest).not.toContain(
      'android:networkSecurityConfig="@xml/network_security_config"',
    );
  });

  test('debug manifest opts into the localhost cleartext config', () => {
    const debugManifest = readRepoFile(
      'android',
      'app',
      'src',
      'debug',
      'AndroidManifest.xml',
    );

    expect(debugManifest).toContain(
      'android:networkSecurityConfig="@xml/network_security_config"',
    );
  });

  test('debug network security config only allows local development hosts', () => {
    const networkSecurityConfig = readRepoFile(
      'android',
      'app',
      'src',
      'debug',
      'res',
      'xml',
      'network_security_config.xml',
    );

    expect(networkSecurityConfig).toContain(
      '<domain includeSubdomains="true">10.0.2.2</domain>',
    );
    expect(networkSecurityConfig).toContain(
      '<domain includeSubdomains="true">localhost</domain>',
    );
    expect(networkSecurityConfig).toContain(
      '<domain-config cleartextTrafficPermitted="true">',
    );
  });
});
