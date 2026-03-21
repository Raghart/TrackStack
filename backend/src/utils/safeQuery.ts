import { InternalServerErrorException } from '@nestjs/common';

const safeQuery = async <T>(fn: () => Promise<T>): Promise<T> => {
  try {
    return await fn();
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown database error';
    throw new InternalServerErrorException(`Database Error: ${message}`);
  }
};

export default safeQuery;
