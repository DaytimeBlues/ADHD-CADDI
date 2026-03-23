export type WebHistorySyncReason = 'ready' | 'state-change';
export type WebHistoryUpdateMode = 'push' | 'replace' | null;

const normalizePath = (path: string) => {
  if (!path.startsWith('/')) {
    return path;
  }

  if (path === '/') {
    return path;
  }

  return path.endsWith('/') ? path.slice(0, -1) : path;
};

export const getHistoryUpdateMode = (
  currentPath: string,
  targetPath: string,
  reason: WebHistorySyncReason,
): WebHistoryUpdateMode => {
  const normalizedTargetPath = normalizePath(targetPath);
  const normalizedCurrentPath = normalizePath(currentPath);

  if (!normalizedTargetPath.startsWith('/')) {
    return null;
  }

  if (normalizedCurrentPath === normalizedTargetPath) {
    return null;
  }

  return reason === 'ready' ? 'replace' : null;
};
