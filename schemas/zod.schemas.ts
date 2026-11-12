import { z } from 'zod';

export const MAX_STRING_LENGTH = 2048;

export const stringSchema = z
  .string()
  .trim()
  .min(1, { error: 'The string must not be empty' })
  .max(MAX_STRING_LENGTH, {
    error: `The string must be at most ${MAX_STRING_LENGTH} characters long`,
  });

const numericStringSchema = z
  .string()
  .refine(
    (value: string) => {
      const trimmed = value.trim();
      return trimmed !== '' && Number.isFinite(Number(trimmed));
    },
    { error: 'The string must contain a finite number' },
  );

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

export const songDetailsSchema = z.object({
  id: positiveIntSchema,
  song_id: positiveIntSchema,
  danceability: z.number(),
  energy: z.number(),
  track_key: z.number(),
  loudness: z.number(),
  mode: z.number(),
  speechiness: z.number(),
  acousticness: z.number(),
  instrumentalness: z.number(),
  liveness: z.number(),
  valence: z.number(),
  tempo: z.number(),
  time_signature: z.number(),
});

const albumReferenceSchema = z.looseObject({
  id: positiveIntSchema.optional(),
  name: stringSchema.optional(),
  url_image: stringSchema,
});

const artistReferenceSchema = z.looseObject({
  id: positiveIntSchema.optional(),
  name: stringSchema,
});

const genreReferenceSchema = z.looseObject({
  id: positiveIntSchema.optional(),
  genre: stringSchema,
});

export const songSchema = z.looseObject({
  id: positiveIntSchema,
  name: stringSchema,
  spotify_id: stringSchema.optional(),
  url_preview: stringSchema,
  duration: floatNumberSchema.optional(),
  year: z.number().optional(),
  album_id: positiveIntSchema.optional(),
  artists: z.array(artistReferenceSchema).optional(),
  album: albumReferenceSchema.optional(),
  genres: z.array(genreReferenceSchema).optional(),
  songDetails: songDetailsSchema.optional(),
});

export const artistSearchResultSchema = z.looseObject({
  id: positiveIntSchema,
  name: stringSchema,
  album_cover: stringSchema,
  type: z.literal('artist'),
});

export type ArtistSearchResultData = z.infer<typeof artistSearchResultSchema>;

export const albumSearchResultSchema = z.looseObject({
  id: positiveIntSchema,
  name: stringSchema,
  artists: z.array(stringSchema),
  album_cover: stringSchema,
  type: z.literal('album'),
});

export type AlbumSearchResultData = z.infer<typeof albumSearchResultSchema>;

export const songSearchResultSchema = z.looseObject({
  id: positiveIntSchema,
  name: stringSchema,
  artists: z.array(stringSchema),
  album: stringSchema,
  album_cover: stringSchema,
  url_preview: stringSchema,
  type: z.literal('song'),
});

export const multipleSearchResultsSchema = z.object({
  artistResults: z.array(artistSearchResultSchema),
  albumResults: z.array(albumSearchResultSchema),
  songResults: z.array(songSearchResultSchema),
  exactArtist: artistSearchResultSchema,
  exactAlbum: albumSearchResultSchema,
  exactSong: songSearchResultSchema,
});

export type multipleSearchResults = z.infer<typeof multipleSearchResultsSchema>;

export type SongSearchResultData = z.infer<typeof songSearchResultSchema>;

export const songRawSchema = z.looseObject({
  id: positiveIntSchema,
  name: stringSchema,
  url_preview: stringSchema,
  artists: z.array(artistReferenceSchema),
  album: albumReferenceSchema,
});

export type SongRawData = z.infer<typeof songRawSchema>;

export const songResponseSchema = z.object({
  id: floatNumberSchema,
  name: stringSchema,
  artists: z.array(stringSchema),
  album_cover: stringSchema,
  url_preview: stringSchema,
});

export type SongResponse = z.infer<typeof songResponseSchema>;

export const albumWithSongsSchema = z.object({
  id: positiveIntSchema,
  name: stringSchema,
  url_image: stringSchema,
  songs: z.array(songSchema).min(1),
});

export type AlbumWithSongsData = z.infer<typeof albumWithSongsSchema>;

export const artistWithSongsSchema = z.looseObject({
  id: positiveIntSchema,
  name: stringSchema,
  songs: z.array(songSchema).min(1),
});

export type ArtistWithSongsData = z.infer<typeof artistWithSongsSchema>;

export const songGenresSchema = z.looseObject({
  id: positiveIntSchema,
  song_id: positiveIntSchema,
  genre_id: positiveIntSchema,
  song: songSchema,
  genre: genreReferenceSchema,
});

export type songGenresData = z.infer<typeof songGenresSchema>;

export const fullRawSongSchema = z.looseObject({
  id: positiveIntSchema,
  name: stringSchema,
  spotify_id: stringSchema,
  url_preview: stringSchema,
  duration: floatNumberSchema,
  year: z.number(),
  artists: z.array(artistReferenceSchema),
  album: albumReferenceSchema,
  genres: z.array(genreReferenceSchema),
});

export type FullRawSong = z.infer<typeof fullRawSongSchema>;

export const fullSongResponseSchema = z.object({
  id: positiveIntSchema,
  name: stringSchema,
  artists: z.array(stringSchema),
  genres: z.array(stringSchema),
  album: stringSchema,
  album_cover: stringSchema,
  duration: floatNumberSchema,
  year: floatNumberSchema,
  spotify_id: stringSchema,
  url_preview: stringSchema,
});

export type FullSongResponse = z.infer<typeof fullSongResponseSchema>;

const songRecommendationSchema = z.object({
  id: positiveIntSchema,
  name: stringSchema,
  artists: stringSchema,
  album_cover: stringSchema,
  url_preview: stringSchema,
  cos_sim: z.number(),
});

export type SongRecommendationResponse = z.infer<typeof songRecommendationSchema>;

export const songRecommendationsSchema = z.array(songRecommendationSchema);

export const albumResponseSchema = z.object({
  id: positiveIntSchema,
  name: stringSchema,
  album_cover: stringSchema,
  artists: z.array(stringSchema),
});

export type AlbumResponse = z.infer<typeof albumResponseSchema>;

export const artistResponseSchema = z.object({
  id: positiveIntSchema,
  name: stringSchema,
  album_cover: stringSchema,
});

export type ArtistResponse = z.infer<typeof artistResponseSchema>;