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

// Configuration
const SOFT_CAP = 350;
const HARD_CAP = 450;
const SRC_DIR = path.join(__dirname, '..', '..', 'src');

// File patterns to check
const CHECK_PATTERNS = [/\.(ts|tsx)$/];

// File patterns to exclude
const EXCLUDE_PATTERNS = [
  /\.d\.ts$/, // Type definitions
  /\.test\.(ts|tsx)$/, // Test files
  /\.spec\.(ts|tsx)$/, // Spec files
  /__tests__\//, // Test directories
  /__mocks__\//, // Mock directories
  /theme\/tokens/, // Token files (static data)
  /\.web\.(ts|tsx)$/, // Web adapters (should be thin)
];

function shouldCheckFile(filePath) {
  const relativePath = path.relative(SRC_DIR, filePath);

  // Must match check patterns
  if (!CHECK_PATTERNS.some((pattern) => pattern.test(filePath))) {
    return false;
  }

  // Must not match exclude patterns
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
    return `\x1b[31m${count.toString().padStart(4)}\x1b[0m`; // Red
  } else if (count > SOFT_CAP) {
    return `\x1b[33m${count.toString().padStart(4)}\x1b[0m`; // Yellow
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
    console.error(`Error: Source directory not found: ${SRC_DIR}`);
    process.exit(1);
  }

  const allFiles = getAllFiles(SRC_DIR);
  const filesToCheck = allFiles.filter(shouldCheckFile);

  const fileStats = filesToCheck.map((filePath) => ({
    path: path.relative(SRC_DIR, filePath),
    fullPath: filePath,
    lines: countLines(filePath),
  }));

  // Sort by line count descending
  fileStats.sort((a, b) => b.lines - a.lines);

  // Find violations
  const softCapViolations = fileStats.filter(
    (f) => f.lines > SOFT_CAP && f.lines <= HARD_CAP,
  );
  const hardCapViolations = fileStats.filter((f) => f.lines > HARD_CAP);

  // Report
  console.log('\n=== File Size Report ===\n');
  console.log(`Soft cap: ${SOFT_CAP} lines`);
  console.log(`Hard cap: ${HARD_CAP} lines`);
  console.log(`Files checked: ${filesToCheck.length}`);
  console.log('');

  // Top N files
  console.log(`Top ${reportTop} largest files:`);
  console.log('-'.repeat(60));
  fileStats.slice(0, reportTop).forEach((file) => {
    const status =
      file.lines > HARD_CAP
        ? ' [HARD CAP]'
        : file.lines > SOFT_CAP
          ? ' [soft cap]'
          : '';
    console.log(`${formatLineCount(file.lines)}  ${file.path}${status}`);
  });

  // Violations summary
  console.log('\n' + '='.repeat(60));

  if (hardCapViolations.length > 0) {
    console.log(
      `\n❌ HARD CAP VIOLATIONS (${hardCapViolations.length} files):`,
    );
    hardCapViolations.forEach((file) => {
      console.log(`   ${file.lines} lines: ${file.path}`);
    });
  }

  if (softCapViolations.length > 0) {
    console.log(
      `\n⚠️  Soft cap violations (${softCapViolations.length} files):`,
    );
    softCapViolations.slice(0, 10).forEach((file) => {
      console.log(`   ${file.lines} lines: ${file.path}`);
    });
    if (softCapViolations.length > 10) {
      console.log(`   ... and ${softCapViolations.length - 10} more`);
    }
  }

  if (hardCapViolations.length === 0 && softCapViolations.length === 0) {
    console.log('\n✅ All files within size limits');
  }

  // Summary stats
  console.log('\n' + '='.repeat(60));
  console.log('Summary:');
  console.log(`  Total files: ${fileStats.length}`);
  console.log(
    `  Under soft cap: ${fileStats.filter((f) => f.lines <= SOFT_CAP).length}`,
  );
  console.log(`  Over soft cap: ${softCapViolations.length}`);
  console.log(`  Over hard cap: ${hardCapViolations.length}`);

  // Exit with error if hard cap violations in CI mode
  if (isCI && hardCapViolations.length > 0) {
    console.log('\n❌ CI check failed: Hard cap violations found\n');
    process.exit(1);
  }

  // Always exit with error on hard cap violations
  if (hardCapViolations.length > 0) {
    console.log('\n');
    process.exit(1);
  }

  console.log('\n');
  process.exit(0);
}

main();
