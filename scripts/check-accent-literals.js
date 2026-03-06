const fs = require('fs');
const path = require('path');

function write(stream, message) {
  stream.write(`${message}\n`);
}

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const TARGET_LITERAL = '#8B5CF6';
const ALLOWLIST = new Set([
  path.join('src', '__tests__', 'cosmic-tokens.test.ts'),
  path.join('src', 'theme', 'cosmicTokens.ts'),
  path.join('src', 'theme', 'linearTokens.ts'),
]);
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);

function collectFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
      continue;
    }

    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function findMatches(filePath) {
  const relativePath = path.relative(ROOT, filePath);
  if (ALLOWLIST.has(relativePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const matches = [];

  lines.forEach((line, index) => {
    if (line.includes(TARGET_LITERAL)) {
      matches.push(`${relativePath}:${index + 1}: ${line.trim()}`);
    }
  });

  return matches;
}

const violations = collectFiles(SRC_DIR).flatMap(findMatches);

if (violations.length > 0) {
  write(
    process.stderr,
    '[accent-literals] Found disallowed hardcoded accent literals outside token files:',
  );
  violations.forEach((violation) => write(process.stderr, `  ${violation}`));
  process.exit(1);
}

write(process.stdout, '[accent-literals] OK');
