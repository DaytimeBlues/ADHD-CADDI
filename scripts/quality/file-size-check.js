#!/usr/bin/env node

/**
 * File Size Check Script
 *
 * Reports the largest source files and fails if any exceed the hard cap.
 *
 * Usage:
 *   node scripts/quality/file-size-check.js
 *   node scripts/quality/file-size-check.js --report-top 30
 *   node scripts/quality/file-size-check.js --ci
 *
 * Exit codes:
 *   0 - All files within limits
 *   1 - One or more files exceed hard cap
 */

const fs = require('fs');
const path = require('path');

const SOFT_CAP = 350;
const HARD_CAP = 450;
const SRC_DIR = path.join(__dirname, '..', '..', 'src');

const CHECK_PATTERNS = [/\.(ts|tsx)$/];

const EXCLUDE_PATTERNS = [
  /\.d\.ts$/,
  /\.test\.(ts|tsx)$/,
  /\.spec\.(ts|tsx)$/,
  /__tests__\//,
  /__mocks__\//,
  /theme\/tokens/,
  /\.web\.(ts|tsx)$/,
];

function writeLine(message = '', stream = process.stdout) {
  stream.write(`${message}\n`);
}

function shouldCheckFile(filePath) {
  const relativePath = path.relative(SRC_DIR, filePath);

  if (!CHECK_PATTERNS.some((pattern) => pattern.test(filePath))) {
    return false;
  }

  if (EXCLUDE_PATTERNS.some((pattern) => pattern.test(relativePath))) {
    return false;
  }

  return true;
}

function countLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n').length;
}

function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (stat.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function formatLineCount(count) {
  if (count > HARD_CAP) {
    return `\x1b[31m${count.toString().padStart(4)}\x1b[0m`;
  }
  if (count > SOFT_CAP) {
    return `\x1b[33m${count.toString().padStart(4)}\x1b[0m`;
  }
  return count.toString().padStart(4);
}

function main() {
  const args = process.argv.slice(2);
  const isCI = args.includes('--ci');
  const reportTopIndex = args.indexOf('--report-top');
  const reportTop =
    reportTopIndex !== -1 ? parseInt(args[reportTopIndex + 1], 10) || 20 : 20;

  if (!fs.existsSync(SRC_DIR)) {
    writeLine(`Error: Source directory not found: ${SRC_DIR}`, process.stderr);
    process.exit(1);
  }

  const allFiles = getAllFiles(SRC_DIR);
  const filesToCheck = allFiles.filter(shouldCheckFile);

  const fileStats = filesToCheck.map((filePath) => ({
    path: path.relative(SRC_DIR, filePath),
    lines: countLines(filePath),
  }));

  fileStats.sort((left, right) => right.lines - left.lines);

  const softCapViolations = fileStats.filter(
    (file) => file.lines > SOFT_CAP && file.lines <= HARD_CAP,
  );
  const hardCapViolations = fileStats.filter((file) => file.lines > HARD_CAP);

  writeLine('\n=== File Size Report ===\n');
  writeLine(`Soft cap: ${SOFT_CAP} lines`);
  writeLine(`Hard cap: ${HARD_CAP} lines`);
  writeLine(`Files checked: ${filesToCheck.length}`);
  writeLine();

  writeLine(`Top ${reportTop} largest files:`);
  writeLine('-'.repeat(60));
  fileStats.slice(0, reportTop).forEach((file) => {
    const status =
      file.lines > HARD_CAP
        ? ' [HARD CAP]'
        : file.lines > SOFT_CAP
          ? ' [soft cap]'
          : '';
    writeLine(`${formatLineCount(file.lines)}  ${file.path}${status}`);
  });

  writeLine('\n' + '='.repeat(60));

  if (hardCapViolations.length > 0) {
    writeLine(
      `\nHARD CAP VIOLATIONS (${hardCapViolations.length} files):`,
      process.stderr,
    );
    hardCapViolations.forEach((file) => {
      writeLine(`   ${file.lines} lines: ${file.path}`, process.stderr);
    });
  }

  if (softCapViolations.length > 0) {
    writeLine(`\nSoft cap violations (${softCapViolations.length} files):`);
    softCapViolations.slice(0, 10).forEach((file) => {
      writeLine(`   ${file.lines} lines: ${file.path}`);
    });
    if (softCapViolations.length > 10) {
      writeLine(`   ... and ${softCapViolations.length - 10} more`);
    }
  }

  if (hardCapViolations.length === 0 && softCapViolations.length === 0) {
    writeLine('\nAll files within size limits');
  }

  writeLine('\n' + '='.repeat(60));
  writeLine('Summary:');
  writeLine(`  Total files: ${fileStats.length}`);
  writeLine(
    `  Under soft cap: ${fileStats.filter((file) => file.lines <= SOFT_CAP).length}`,
  );
  writeLine(`  Over soft cap: ${softCapViolations.length}`);
  writeLine(`  Over hard cap: ${hardCapViolations.length}`);

  if (isCI && hardCapViolations.length > 0) {
    writeLine('\nCI check failed: Hard cap violations found\n', process.stderr);
    process.exit(1);
  }

  if (hardCapViolations.length > 0) {
    writeLine('\n', process.stderr);
    process.exit(1);
  }

  writeLine();
}

main();
