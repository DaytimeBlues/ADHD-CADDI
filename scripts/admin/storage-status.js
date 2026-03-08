const { readFileSync } = require('fs');
const { resolve } = require('path');

const writeStdout = (message) => process.stdout.write(`${message}\n`);
const writeStderr = (message) => process.stderr.write(`${message}\n`);

const storageServicePath = resolve(
  process.cwd(),
  'src/services/StorageService.ts',
);
const source = readFileSync(storageServicePath, 'utf8');

const versionMatch = source.match(/const STORAGE_VERSION = (\d+);/);
const keyMatch = source.match(/const STORAGE_VERSION_KEY = '([^']+)';/);
const migrationMatches = [...source.matchAll(/^\s{2}(\d+): async/gm)];

if (!versionMatch || !keyMatch) {
  writeStderr('ERROR: unable to read storage migration metadata.');
  process.exit(1);
}

writeStdout('Admin storage status');
writeStdout(`Storage version: ${versionMatch[1]}`);
writeStdout(`Storage version key: ${keyMatch[1]}`);
writeStdout(
  `Defined migrations: ${migrationMatches.map((match) => match[1]).join(', ') || 'none'}`,
);

process.exit(0);
