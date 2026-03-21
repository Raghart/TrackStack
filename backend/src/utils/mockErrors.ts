import { InternalServerErrorException } from '@nestjs/common';

export const SequelizeTimeoutError = () =>
  jest
    .fn()
    .mockRejectedValue(new Error('SequelizeTimeoutError: Query timed out'));
export const SequelizeConnectionError = () =>
  jest
    .fn()
    .mockRejectedValue(new Error('SequelizeTimeoutError: Connection refused'));

export const TimeoutResError = () =>
  jest
    .fn()
    .mockRejectedValue(
      new InternalServerErrorException(
        new Error(`Database Error: SequelizeTimeoutError: Query timed out`),
      ),
    );

export const ConnectionResError = () =>
  jest
    .fn()
    .mockRejectedValue(
      new InternalServerErrorException(
        new Error(`Database Error: SequelizeTimeoutError: Connection refused`),
      ),
    );
