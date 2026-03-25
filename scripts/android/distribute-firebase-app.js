const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REQUIRED_ENV_VARS = ['FIREBASE_APP_ID', 'FIREBASE_TESTERS'];
const DEFAULT_PREVIEW_APK_RELATIVE_PATHS = [
  'android/app/build/outputs/apk/preview/app-preview.apk',
];

function validateDistributionEnv(env) {
  const missing = REQUIRED_ENV_VARS.filter((key) => !env[key]);
  return {
    ok: missing.length === 0,
    missing,
  };
}

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const next = argv[index + 1];

    if (token === '--app' && next) {
      parsed.appId = next;
      index += 1;
    } else if (token === '--testers' && next) {
      parsed.testers = next;
      index += 1;
    } else if (token === '--apk' && next) {
      parsed.apkPath = next;
      index += 1;
    } else if (token === '--release-notes' && next) {
      parsed.releaseNotes = next;
      index += 1;
    }
  }

  return parsed;
}

function getCandidateApkPaths(repoRoot, env) {
  const candidates = DEFAULT_PREVIEW_APK_RELATIVE_PATHS.map((relativePath) =>
    path.join(repoRoot, relativePath),
  );

  if (env.LOCALAPPDATA) {
    candidates.unshift(
      path.join(
        env.LOCALAPPDATA,
        'ADHD-CADDI-V1',
        'android-build',
        'app',
        'outputs',
        'apk',
        'preview',
        'app-preview.apk',
      ),
    );
  }

  return candidates;
}

function resolveDefaultApkPath(repoRoot, env) {
  const match = getCandidateApkPaths(repoRoot, env).find((candidate) =>
    fs.existsSync(candidate),
  );

  if (!match) {
    throw new Error(
      'Could not find a preview APK. Run `npm run build:android:preview` first or pass --apk <path>.',
    );
  }

  return match;
}

function buildDistributeArgs({ apkPath, appId, testers, releaseNotes }) {
  const args = [
    'appdistribution:distribute',
    apkPath,
    '--app',
    appId,
    '--testers',
    testers,
  ];

  if (releaseNotes) {
    args.push('--release-notes', releaseNotes);
  }

  return args;
}

function main() {
  const repoRoot = path.resolve(__dirname, '..', '..');
  const options = parseArgs(process.argv.slice(2));
  const mergedEnv = {
    FIREBASE_APP_ID: options.appId || process.env.FIREBASE_APP_ID,
    FIREBASE_TESTERS: options.testers || process.env.FIREBASE_TESTERS,
  };

  const validation = validateDistributionEnv(mergedEnv);
  if (!validation.ok) {
    throw new Error(
      `Missing required Firebase distribution values: ${validation.missing.join(', ')}`,
    );
  }

  const apkPath =
    options.apkPath || resolveDefaultApkPath(repoRoot, process.env);
  const args = buildDistributeArgs({
    apkPath,
    appId: mergedEnv.FIREBASE_APP_ID,
    testers: mergedEnv.FIREBASE_TESTERS,
    releaseNotes:
      options.releaseNotes ||
      `ADHD-CADDI Android preview ${new Date().toISOString().slice(0, 10)}`,
  });

  const result = spawnSync('firebase', args, {
    cwd: repoRoot,
    env: process.env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    throw new Error('Firebase App Distribution upload failed');
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  REQUIRED_ENV_VARS,
  DEFAULT_PREVIEW_APK_RELATIVE_PATHS,
  buildDistributeArgs,
  resolveDefaultApkPath,
  validateDistributionEnv,
};
