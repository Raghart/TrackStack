import { describe, expect, it } from 'vitest';
import {
  MAX_STRING_LENGTH,
  aiStreamChunkSchema,
  albumResponseSchema,
  durationSchema,
  floatNumberSchema,
  fullSongResponseSchema,
  httpUrlSchema,
  positiveIntSchema,
  songResponseSchema,
  spotifyIdSchema,
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

describe('aiStreamChunkSchema', () => {
  it('keeps non-empty text untouched, including whitespace', () => {
    expect(aiStreamChunkSchema.parse('Hello')).toBe('Hello');
    expect(aiStreamChunkSchema.parse(' world ')).toBe(' world ');
    expect(aiStreamChunkSchema.parse('\n')).toBe('\n');
  });

  it('normalizes an empty string to an empty string', () => {
    expect(aiStreamChunkSchema.parse('')).toBe('');
  });

  it('normalizes null to an empty string', () => {
    expect(aiStreamChunkSchema.parse(null)).toBe('');
  });

  it('normalizes undefined to an empty string', () => {
    expect(aiStreamChunkSchema.parse(undefined)).toBe('');
  });

  it('rejects values that are not strings, null or undefined', () => {
    for (const value of [123, true, {}, []]) {
      expect(aiStreamChunkSchema.safeParse(value).success).toBe(false);
    }
  });
});

describe('httpUrlSchema', () => {
  it('accepts absolute http and https URLs', () => {
    const urls = [
      'https://i.scdn.co/image/ab67616d0000b27385e5dcc05cc216a10f141480',
      'http://localhost:3000/graphql',
      'https://example.com/path?query=1#fragment',
      'HTTPS://EXAMPLE.COM/cover.jpg',
    ];

    for (const value of urls) {
      expect(httpUrlSchema.safeParse(value).success).toBe(true);
    }
  });

  it('trims surrounding whitespace before validating', () => {
    expect(httpUrlSchema.parse('  https://example.com/cover.jpg  ')).toBe(
      'https://example.com/cover.jpg',
    );
  });

  it('rejects URLs with unsafe or unsupported protocols', () => {
    const urls = [
      'javascript:alert(1)',
      'data:image/png;base64,aGVsbG8=',
      'file:///etc/passwd',
      'ftp://example.com/file.mp3',
    ];

    for (const value of urls) {
      expect(httpUrlSchema.safeParse(value).success).toBe(false);
    }
  });

  it('rejects relative, empty and malformed URLs', () => {
    for (const value of ['', '   ', '/cover.jpg', 'example.com', 'http://']) {
      expect(httpUrlSchema.safeParse(value).success).toBe(false);
    }
  });

  it('rejects non-string values', () => {
    for (const value of [123, null, undefined, {}]) {
      expect(httpUrlSchema.safeParse(value).success).toBe(false);
    }
  });
});

describe('spotifyIdSchema', () => {
  it('accepts 22-character alphanumeric IDs', () => {
    expect(spotifyIdSchema.parse('0keNu0t0tqsWtExGM3nT1D')).toBe(
      '0keNu0t0tqsWtExGM3nT1D',
    );
    expect(spotifyIdSchema.parse('a'.repeat(22))).toBe('a'.repeat(22));
  });

  it('trims surrounding whitespace before validating', () => {
    expect(spotifyIdSchema.parse('  0keNu0t0tqsWtExGM3nT1D  ')).toBe(
      '0keNu0t0tqsWtExGM3nT1D',
    );
  });

  it('rejects IDs with the wrong length', () => {
    for (const value of ['a'.repeat(21), 'a'.repeat(23), '', 'testingID']) {
      expect(spotifyIdSchema.safeParse(value).success).toBe(false);
    }
  });

  it('rejects IDs with characters outside the alphanumeric set', () => {
    for (const value of ['a'.repeat(21) + '-', 'a'.repeat(21) + '_', 'a'.repeat(21) + ' ']) {
      expect(spotifyIdSchema.safeParse(value).success).toBe(false);
    }
  });

  it('rejects non-string values', () => {
    for (const value of [123, null, undefined, {}]) {
      expect(spotifyIdSchema.safeParse(value).success).toBe(false);
    }
  });
});

describe('response schemas URL validation', () => {
  const songResponse = {
    id: 1,
    name: 'Come as You Are',
    artists: ['Nirvana'],
    album_cover: 'https://i.scdn.co/image/cover.jpg',
    url_preview: 'https://p.scdn.co/mp3-preview/preview.mp3',
  };

  it('accepts response payloads with http(s) URLs', () => {
    expect(songResponseSchema.safeParse(songResponse).success).toBe(true);
    expect(
      albumResponseSchema.safeParse({
        id: 1,
        name: 'Nevermind',
        album_cover: 'https://i.scdn.co/image/cover.jpg',
        artists: ['Nirvana'],
      }).success,
    ).toBe(true);
  });

  it('rejects a javascript: preview URL', () => {
    const result = songResponseSchema.safeParse({
      ...songResponse,
      url_preview: 'javascript:alert(1)',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a data: cover URL', () => {
    const result = albumResponseSchema.safeParse({
      id: 1,
      name: 'Nevermind',
      album_cover: 'data:image/png;base64,aGVsbG8=',
      artists: ['Nirvana'],
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid Spotify IDs in full song responses', () => {
    const fullSong = {
      id: 1,
      name: 'Come as You Are',
      artists: ['Nirvana'],
      genres: ['Rock'],
      album: 'Nevermind',
      album_cover: 'https://i.scdn.co/image/cover.jpg',
      duration: 2.5,
      year: 1991,
      spotify_id: '0keNu0t0tqsWtExGM3nT1D',
      url_preview: 'https://p.scdn.co/mp3-preview/preview.mp3',
    };

    expect(fullSongResponseSchema.safeParse(fullSong).success).toBe(true);
    expect(
      fullSongResponseSchema.safeParse({
        ...fullSong,
        spotify_id: 'not-a-valid-spotify-id',
      }).success,
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
