import { ServiceUnavailableException } from '@nestjs/common';

export const safeSearch = async <T>(fn: () => Promise<T>): Promise<T> => {
  try {
    return await fn();
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknow database error';
    throw new ServiceUnavailableException(
      'ElasticSearch is not responding: ' + message,
    );
  }
};
