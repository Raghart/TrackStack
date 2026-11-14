import { describe, expect, it } from 'vitest';
import {
  userVectorSchema,
} from './zod.schemas';
import { USER_VECTOR_LENGTH } from './zod.contants';

const validUserVector = [0.5, 0.75, 0.5, 0.6, 0.75, 0.65, 0.6, 0.6];

describe('userVectorSchema', () => {
  it('accepts exactly eight finite values within their ranges', () => {
    expect(userVectorSchema.parse(validUserVector)).toEqual(validUserVector);
  });

  it('accepts the maximum value produced for each position', () => {
    expect(
      userVectorSchema.parse([
        1.0141987829614605, 1.5, 1, 1.0440251572327044,
        1.2801204923463385, 1.1711711560777138, 1.2084592145015105,
        1.1955043010527637,
      ]),
    ).toHaveLength(USER_VECTOR_LENGTH);
  });

  it('accepts the minimum value produced for each position', () => {
    expect(
      userVectorSchema.parse([
        0, 0, 0, 0.13836477987421386, 0.1054216876049926,
        0.04004003952402441, 0, 0,
      ]),
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
    ]) {
      expect(userVectorSchema.safeParse(value).success).toBe(false);
    }
  });
});
