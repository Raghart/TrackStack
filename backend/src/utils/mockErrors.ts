import { InternalServerErrorException } from '@nestjs/common';

export const SequelizeTimeoutError = () =>
  vi.fn()
    .mockRejectedValue(new Error('SequelizeTimeoutError: Query timed out'));
export const SequelizeConnectionError = () =>
  vi.fn()
    .mockRejectedValue(new Error('SequelizeTimeoutError: Connection refused'));

export const TimeoutResError = () =>
  vi.fn()
    .mockRejectedValue(
      new InternalServerErrorException(
        new Error(`Database Error: SequelizeTimeoutError: Query timed out`),
      ),
    );

export const ConnectionResError = () =>
  vi.fn()
    .mockRejectedValue(
      new InternalServerErrorException(
        new Error(`Database Error: SequelizeTimeoutError: Connection refused`),
      ),
    );
