import { describe, expect, it } from 'vitest';
import {
  MAX_STRING_LENGTH,
  durationSchema,
  floatNumberSchema,
  positiveIntSchema,
  stringSchema,
  yearSchema,
} from './zod.schemas';

describe('stringSchema', () => {
  it('accepts non-empty strings', () => {
    expect(stringSchema.parse('hello')).toBe('hello');
  });

  it('trims surrounding whitespace', () => {
    expect(stringSchema.parse('  hello  ')).toBe('hello');
  });

  it('rejects empty or whitespace-only strings', () => {
    for (const value of ['', '   ', '\n\t']) {
      expect(stringSchema.safeParse(value).success).toBe(false);
    }
  });

  it('rejects non-string values', () => {
    expect(stringSchema.safeParse(123).success).toBe(false);
    expect(stringSchema.safeParse(null).success).toBe(false);
  });

  it('rejects strings longer than the maximum length', () => {
    expect(stringSchema.safeParse('a'.repeat(MAX_STRING_LENGTH)).success).toBe(
      true,
    );
    expect(
      stringSchema.safeParse('a'.repeat(MAX_STRING_LENGTH + 1)).success,
    ).toBe(false);
  });
});

describe('floatNumberSchema', () => {
  it('accepts finite numbers', () => {
    expect(floatNumberSchema.parse(1.5)).toBe(1.5);
    expect(floatNumberSchema.parse(-3)).toBe(-3);
    expect(floatNumberSchema.parse(0)).toBe(0);
  });

  it('parses finite numeric strings', () => {
    expect(floatNumberSchema.parse('2.5')).toBe(2.5);
    expect(floatNumberSchema.parse(' -3 ')).toBe(-3);
    expect(floatNumberSchema.parse('1e3')).toBe(1000);
  });

  it('rejects non-finite numbers and strings', () => {
    for (const value of [Infinity, -Infinity, NaN]) {
      expect(floatNumberSchema.safeParse(value).success).toBe(false);
    }

    for (const value of ['Infinity', '-Infinity', 'NaN']) {
      expect(floatNumberSchema.safeParse(value).success).toBe(false);
    }
  });

  it('rejects non-numeric or empty strings', () => {
    for (const value of ['', '   ', 'abc', '1abc']) {
      expect(floatNumberSchema.safeParse(value).success).toBe(false);
    }
  });
});

describe('positiveIntSchema', () => {
  it('accepts positive integers and numeric strings', () => {
    expect(positiveIntSchema.parse(1)).toBe(1);
    expect(positiveIntSchema.parse('42')).toBe(42);
  });

  it('rejects zero, negatives and decimals', () => {
    for (const value of [0, -1, 1.5, '0', '-1', '1.5']) {
      expect(positiveIntSchema.safeParse(value).success).toBe(false);
    }
  });

  it('rejects non-numeric and non-finite values', () => {
    for (const value of ['abc', '', Infinity, NaN, 'Infinity']) {
      expect(positiveIntSchema.safeParse(value).success).toBe(false);
    }
  });
});

describe('yearSchema', () => {
  it('accepts years between 1900 and 2100', () => {
    expect(yearSchema.parse(1900)).toBe(1900);
    expect(yearSchema.parse(2100)).toBe(2100);
    expect(yearSchema.parse('2024')).toBe(2024);
  });

  it('rejects years outside the allowed range', () => {
    for (const value of [1899, 2101, '1899', '2101']) {
      expect(yearSchema.safeParse(value).success).toBe(false);
    }
  });

  it('rejects decimals and non-numeric values', () => {
    for (const value of [2024.5, '2024.5', 'abc', '', Infinity]) {
      expect(yearSchema.safeParse(value).success).toBe(false);
    }
  });
});

describe('durationSchema', () => {
  it('accepts finite positive numbers and numeric strings', () => {
    expect(durationSchema.parse(1)).toBe(1);
    expect(durationSchema.parse(0.5)).toBe(0.5);
    expect(durationSchema.parse('30.5')).toBe(30.5);
  });

  it('rejects zero and negative values', () => {
    for (const value of [0, -1, '0', '-1']) {
      expect(durationSchema.safeParse(value).success).toBe(false);
    }
  });

  it('rejects non-finite and non-numeric values', () => {
    for (const value of [Infinity, NaN, 'Infinity', 'abc', '']) {
      expect(durationSchema.safeParse(value).success).toBe(false);
    }
  });
});
