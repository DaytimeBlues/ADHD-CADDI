const { readFileSync } = require('fs');
const { resolve } = require('path');

const writeStdout = (message) => process.stdout.write(`${message}\n`);
const writeStderr = (message) => process.stderr.write(`${message}\n`);

const backupManagerPath = resolve(
  process.cwd(),
  'src/screens/diagnostics/hooks/useBackupManager.ts',
);
const storageServicePath = resolve(
  process.cwd(),
  'src/services/StorageService.ts',
);

const backupSource = readFileSync(backupManagerPath, 'utf8');
const storageSource = readFileSync(storageServicePath, 'utf8');

const diagnostics = [];

if (!backupSource.includes("const BACKUP_SCHEMA = 'spark-backup-v1'")) {
  diagnostics.push(
    'Backup schema constant is missing or changed unexpectedly.',
  );
}

if (!backupSource.includes("const BACKUP_APP_ID = 'spark-adhd'")) {
  diagnostics.push(
    'Backup app ID constant is missing or changed unexpectedly.',
  );
}

if (!storageSource.includes("backupLastExportAt: 'backupLastExportAt'")) {
  diagnostics.push('Storage key backupLastExportAt is missing.');
}

if (!backupSource.includes('StorageService.STORAGE_KEYS.backupLastExportAt')) {
  diagnostics.push(
    'Backup export timestamp is not wired through StorageService.',
  );
}

writeStdout('Admin backup check');

if (diagnostics.length === 0) {
  writeStdout('PASS: backup wiring looks consistent.');
  process.exit(0);
}

diagnostics.forEach((diagnostic) => writeStderr(`ERROR: ${diagnostic}`));
process.exit(1);
