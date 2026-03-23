const fs = require('fs');
const path = require('path');

const issueDir = path.resolve(process.cwd(), 'output', 'playwright', 'issues');
const summaryPath = path.join(issueDir, 'summary.json');

const issueFiles = fs.existsSync(issueDir)
  ? fs
      .readdirSync(issueDir)
      .filter((file) => file.endsWith('.json') && file !== 'summary.json')
  : [];

const issues = issueFiles.map((file) =>
  JSON.parse(fs.readFileSync(path.join(issueDir, file), 'utf8')),
);

const grouped = issues.reduce((accumulator, issue) => {
  const key = issue.issueType || 'unknown';
  accumulator[key] = accumulator[key] || [];
  accumulator[key].push({
    testName: issue.testName || issue.skippedTests || 'unknown',
    summary: issue.summary || issue.reason || 'no summary',
    url: issue.url || null,
  });
  return accumulator;
}, {});

const summary = {
  generatedAt: new Date().toISOString(),
  issueCount: issues.length,
  byType: Object.fromEntries(
    Object.entries(grouped).map(([type, entries]) => [type, entries.length]),
  ),
  issuesByType: grouped,
};

fs.mkdirSync(issueDir, { recursive: true });
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
