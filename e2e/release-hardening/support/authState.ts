import fs from 'fs';
import path from 'path';

export type CheckedLocation = {
  path: string;
  exists: boolean;
};

export type DiscoveredAuthState = {
  storageStatePath: string | null;
  checkedLocations: CheckedLocation[];
};

const resolveCandidateFiles = (): string[] => {
  const cwd = process.cwd();
  const envPath = process.env.PLAYWRIGHT_AUTH_STORAGE;

  return [
    envPath,
    path.join(cwd, 'playwright', '.auth', 'user.json'),
    path.join(cwd, 'playwright', '.auth', 'state.json'),
    path.join(cwd, '.auth', 'user.json'),
    path.join(cwd, '.auth', 'state.json'),
    path.join(cwd, 'test-artifacts', 'auth', 'user.json'),
    path.join(cwd, 'output', 'playwright', 'auth', 'user.json'),
  ].filter((candidate): candidate is string => Boolean(candidate));
};

const isLikelyStorageStateFile = (filePath: string) => {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const cookies = Array.isArray(parsed.cookies) ? parsed.cookies : [];
    const origins = Array.isArray(parsed.origins) ? parsed.origins : [];
    return cookies.length > 0 || origins.length > 0;
  } catch {
    return false;
  }
};

export const discoverAuthState = (): DiscoveredAuthState => {
  const candidates = resolveCandidateFiles();
  const checkedLocations = candidates.map((candidate) => ({
    path: candidate,
    exists: fs.existsSync(candidate),
  }));

  const storageStatePath =
    checkedLocations.find(
      (candidate) =>
        candidate.exists && isLikelyStorageStateFile(candidate.path),
    )?.path ?? null;

  return {
    storageStatePath,
    checkedLocations,
  };
};
