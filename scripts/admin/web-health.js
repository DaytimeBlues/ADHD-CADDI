const { existsSync } = require('fs');
const { resolve } = require('path');

const writeStdout = (message) => process.stdout.write(`${message}\n`);
const writeStderr = (message) => process.stderr.write(`${message}\n`);

const requiredFiles = [
  'webpack.config.js',
  'playwright.config.ts',
  'e2e/smoke-basic.spec.ts',
];

writeStdout('Admin web health');

const missing = requiredFiles.filter(
  (relativePath) => !existsSync(resolve(process.cwd(), relativePath)),
);

if (missing.length > 0) {
  missing.forEach((path) => writeStderr(`ERROR: missing ${path}`));
  process.exit(1);
}

writeStdout('PASS: web health entrypoints are present.');
process.exit(0);
