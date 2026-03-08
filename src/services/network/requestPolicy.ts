import type { OperationContext } from '../OperationContext';

export class RequestTimeoutError extends Error {
  constructor(message = 'Request timed out.') {
    super(message);
    this.name = 'RequestTimeoutError';
  }
}

type FetchWithPolicyOptions = {
  timeoutMs: number;
  signal?: AbortSignal;
  operationContext?: OperationContext;
};

const toHeaders = (headers?: HeadersInit): Headers => {
  return new Headers(headers);
};

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const fetchWithPolicy = async (
  url: string,
  init: RequestInit = {},
  options: FetchWithPolicyOptions,
): Promise<Response> => {
  const controller = new AbortController();
  const headers = toHeaders(init.headers);
  let timedOut = false;

  if (
    options.operationContext?.correlationId &&
    !headers.has('X-Correlation-ID')
  ) {
    headers.set('X-Correlation-ID', options.operationContext.correlationId);
  }

  const onAbort = () => {
    controller.abort();
  };

  if (options.signal?.aborted) {
    controller.abort();
  }

  options.signal?.addEventListener('abort', onAbort, { once: true });

  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, options.timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      headers,
      signal: controller.signal,
    });
  } catch (error) {
    if (timedOut) {
      throw new RequestTimeoutError();
    }

    throw error;
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener('abort', onAbort);
  }
};
