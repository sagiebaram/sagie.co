import * as Sentry from '@sentry/nextjs';

export async function notionWrite<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    Sentry.captureException(err, {
      tags: { service: 'notion', type: 'write_failure' },
    });
    throw err;
  }
}
