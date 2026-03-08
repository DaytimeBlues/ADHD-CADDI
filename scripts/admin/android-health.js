const { existsSync } = require('fs');
const { resolve } = require('path');

const writeStdout = (message) => process.stdout.write(`${message}\n`);
const writeStderr = (message) => process.stderr.write(`${message}\n`);

writeStdout('Admin android health');

const requiredFiles = [
  'android/gradlew.bat',
  'scripts/check_android_health.bat',
];
const missing = requiredFiles.filter(
  (relativePath) => !existsSync(resolve(process.cwd(), relativePath)),
);

if (missing.length > 0) {
  missing.forEach((path) => writeStderr(`ERROR: missing ${path}`));
  process.exit(1);
}

writeStdout('PASS: Android health entrypoints are present.');
writeStdout(
  'Run scripts/check_android_health.bat on Windows for the full environment check.',
);
process.exit(0);
