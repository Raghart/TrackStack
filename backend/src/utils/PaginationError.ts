import { BadRequestException } from '@nestjs/common';

export class InvalidPaginationException extends BadRequestException {
  constructor(field: string, value: number) {
    super(`Invalid ${field}: ${value} must be >= 1`);
  }
}
