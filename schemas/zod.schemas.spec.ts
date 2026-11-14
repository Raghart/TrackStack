import { describe, expect, it } from 'vitest';
import {
  paginationSchema,
  recommendationRequestSchema,
  userVectorSchema,
} from './zod.schemas';
import { limitSchema, positiveIntSchema } from './zod.parsers';
import { MAX_LIMIT, USER_VECTOR_LENGTH } from './zod.contants';

const validUserVector = [0.5, 0.75, 0.5, 0.6, 0.75, 0.65, 0.6, 0.6];

describe('pagination schemas', () => {
  it('accepts a valid page and limit', () => {
    expect(paginationSchema.parse({ page: 1, limit: 20 })).toEqual({
      page: 1,
      limit: 20,
    });
    expect(paginationSchema.parse({ page: '2', limit: '40' })).toEqual({
      page: 2,
      limit: 40,
    });
  });

  it('rejects a page lower than 1', () => {
    for (const value of [0, -1, '0']) {
      expect(limitSchema.safeParse(value).success).toBe(false);
    }
  });

  it('rejects limits outside the allowed range', () => {
    for (const value of [0, -1, MAX_LIMIT + 1]) {
      expect(limitSchema.safeParse(value).success).toBe(false);
    }
  });
});

describe('userVectorSchema', () => {
  it('accepts exactly eight finite values within their ranges', () => {
    expect(userVectorSchema.parse(validUserVector)).toEqual(validUserVector);
  });

  it('accepts the maximum value produced for each position', () => {
    expect(
      userVectorSchema.parse([1, 1.5, 1, 1.2, 1.5, 1.3, 1.2, 1.2]),
    ).toHaveLength(USER_VECTOR_LENGTH);
  });

  it('rejects vectors with a different length', () => {
    expect(userVectorSchema.safeParse(validUserVector.slice(0, 7)).success).toBe(
      false,
    );
    expect(
      userVectorSchema.safeParse([...validUserVector, 0.5]).success,
    ).toBe(false);
  });

  it('rejects non-finite, negative and out-of-range values', () => {
    for (const value of [
      [0.5, 0.75, 0.5, 0.6, 0.75, 0.65, 0.6, Infinity],
      [0.5, 0.75, 0.5, 0.6, 0.75, 0.65, 0.6, NaN],
      [-0.1, 0.75, 0.5, 0.6, 0.75, 0.65, 0.6, 0.6],
      [0.5, 1.6, 0.5, 0.6, 0.75, 0.65, 0.6, 0.6],
    ]) {
      expect(userVectorSchema.safeParse(value).success).toBe(false);
    }
  });
});

describe('recommendationRequestSchema', () => {
  it('accepts a valid recommendation request', () => {
    expect(
      recommendationRequestSchema.parse({
        genres: ['Rock', 'Pop'],
        userVector: validUserVector,
        limit: 40,
      }),
    ).toEqual({
      genres: ['Rock', 'Pop'],
      userVector: validUserVector,
      limit: 40,
    });
  });

  it('accepts an empty genre list but rejects invalid genres', () => {
    expect(
      recommendationRequestSchema.safeParse({
        genres: [],
        userVector: validUserVector,
        limit: 40,
      }).success,
    ).toBe(true);

    expect(
      recommendationRequestSchema.safeParse({
        genres: [''],
        userVector: validUserVector,
        limit: 40,
      }).success,
    ).toBe(false);
  });

  it('rejects an invalid vector or limit', () => {
    expect(
      recommendationRequestSchema.safeParse({
        genres: ['Rock'],
        userVector: validUserVector.slice(0, 7),
        limit: 40,
      }).success,
    ).toBe(false);

    expect(
      recommendationRequestSchema.safeParse({
        genres: ['Rock'],
        userVector: validUserVector,
        limit: MAX_LIMIT + 1,
      }).success,
    ).toBe(false);
  });
});
