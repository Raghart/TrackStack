import z from "zod";
import { MAX_SEARCH_QUERY_LENGTH, MIN_SEARCH_QUERY_LENGTH } from "./zod.contants";

export const MAX_STRING_LENGTH = 2048;

export const stringSchema = z
  .string()
  .trim()
  .min(1, { error: 'The string must not be empty' })
  .max(MAX_STRING_LENGTH, {
    error: `The string must be at most ${MAX_STRING_LENGTH} characters long`,
  });

export const aiStreamChunkSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value: string | null | undefined) => value ?? '')
  .describe('AI stream chunk; null and undefined normalized to an empty string');

export const httpUrlSchema = stringSchema
  .refine(
    (value: string) => {
      try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    },
    { error: 'The string must be a valid http or https URL' },
  )
  .describe('absolute URL with the http or https protocol');

export const wsUrlSchema = stringSchema
  .refine(
    (value: string) => {
      try {
        const url = new URL(value);
        return url.protocol === 'ws:' || url.protocol === 'wss:';
      } catch {
        return false;
      }
    },
    { error: 'The string must be a valid ws or wss URL' },
  )
  .describe('absolute URL with the ws or wss protocol');

export const SPOTIFY_ID_PATTERN = /^[A-Za-z0-9]{22}$/;

export const spotifyIdSchema = z
  .string()
  .trim()
  .regex(SPOTIFY_ID_PATTERN, {
    error: 'The Spotify ID must be 22 alphanumeric characters long',
  })
  .describe('22-character alphanumeric Spotify ID');

export const numericStringSchema = z
  .string()
  .trim()
  .refine(
    (value: string) => value !== '' && Number.isFinite(Number(value)),
    { error: 'The string must contain a finite number' },
  )
  .describe('string containing a finite number');

const numericSchema = z
  .union([z.number(), numericStringSchema])
  .transform((value: number | string) =>
    typeof value === 'string' ? Number(value.trim()) : value,
  );

export const floatNumberSchema = numericSchema
  .refine((value: number) => Number.isFinite(value), {
    error: 'The number must be finite',
  })
  .describe('finite number or numeric string, parsed to number');

export const positiveIntSchema = numericSchema
  .refine((value: number) => Number.isInteger(value) && value > 0, {
    error: 'The number must be a positive integer',
  })
  .describe('positive integer or numeric string, parsed to number');

export const yearSchema = numericSchema
  .refine(
    (value: number) => Number.isInteger(value) && value >= 1900 && value <= 2100,
    { error: 'The year must be an integer between 1900 and 2100' },
  )
  .describe('year between 1900 and 2100, parsed to number');

export const durationSchema = numericSchema
  .refine((value: number) => Number.isFinite(value) && value > 0, {
    error: 'The duration must be a finite positive number',
  })
  .describe('finite positive number or numeric string, parsed to number');

export const searchQuerySchema = z
  .string()
  .trim()
  .min(MIN_SEARCH_QUERY_LENGTH, {
    error: `The search query must be at least ${MIN_SEARCH_QUERY_LENGTH} character long`,
  })
  .max(MAX_SEARCH_QUERY_LENGTH, {
    error: `The search query must be at most ${MAX_SEARCH_QUERY_LENGTH} characters long`,
  })
  .describe('trimmed search query with a bounded length');