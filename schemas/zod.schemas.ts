import { z } from 'zod';

export const stringSchema = z
  .string()
  .refine((value: string) => value.trim() !== '', {
    error: 'The string must not be empty',
  });

const numericStringSchema = z
  .string()
  .refine(
    (value: string) => value.trim() !== '' && !Number.isNaN(Number(value.trim())),
    { error: 'The string must contain a valid number' },
  );

export const floatNumberSchema = z
  .union([z.number(), numericStringSchema])
  .transform((value: number | string) =>
    typeof value === 'string' ? parseFloat(value.trim()) : value,
  )
  .describe('number or numeric string, parsed to number');

export const songDetailsSchema = z.object({
  id: z.number(),
  song_id: z.number(),
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

export const albumReferenceSchema = z.looseObject({
  id: z.number().optional(),
  name: stringSchema.optional(),
  url_image: stringSchema,
});

export const artistReferenceSchema = z.looseObject({
  id: z.number().optional(),
  name: stringSchema,
});

export const genreReferenceSchema = z.looseObject({
  id: z.number().optional(),
  genre: stringSchema,
});

export const songSchema = z.looseObject({
  id: z.number(),
  name: stringSchema,
  spotify_id: stringSchema.optional(),
  url_preview: stringSchema,
  duration: z.number().optional(),
  year: z.number().optional(),
  album_id: z.number().optional(),
  artists: z.array(artistReferenceSchema).optional(),
  album: albumReferenceSchema.optional(),
  genres: z.array(genreReferenceSchema).optional(),
  songDetails: songDetailsSchema.optional(),
});

export const artistSearchResultSchema = z.looseObject({
  id: z.number(),
  name: stringSchema,
  album_cover: stringSchema,
  type: z.literal('artist'),
});

export type ArtistSearchResultData = z.infer<typeof artistSearchResultSchema>;

export const albumSearchResultSchema = z.looseObject({
  id: z.number(),
  name: stringSchema,
  artists: z.array(stringSchema),
  album_cover: stringSchema,
  type: z.literal('album'),
});

export type AlbumSearchResultData = z.infer<typeof albumSearchResultSchema>;

export const songSearchResultSchema = z.looseObject({
  id: z.number(),
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
  id: z.number(),
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
  id: z.number(),
  name: stringSchema,
  url_image: stringSchema,
  songs: z.array(songSchema).min(1),
});

export type AlbumWithSongsData = z.infer<typeof albumWithSongsSchema>;

export const artistWithSongsSchema = z.looseObject({
  id: z.number(),
  name: stringSchema,
  songs: z.array(songSchema).min(1),
});

export type ArtistWithSongsData = z.infer<typeof artistWithSongsSchema>;

export const songGenresSchema = z.looseObject({
  id: z.number(),
  song_id: z.number(),
  genre_id: z.number(),
  song: songSchema,
  genre: genreReferenceSchema,
});

export type songGenresData = z.infer<typeof songGenresSchema>;

export const fullRawSongSchema = z.looseObject({
  id: z.number(),
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
  id: z.number(),
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
  id: z.number(),
  name: stringSchema,
  artists: stringSchema,
  album_cover: stringSchema,
  url_preview: stringSchema,
  cos_sim: z.number(),
});

export type SongRecommendationResponse = z.infer<typeof songRecommendationSchema>;

export const songRecommendationsSchema = z.array(songRecommendationSchema);

export const albumResponseSchema = z.object({
  id: z.number(),
  name: stringSchema,
  album_cover: stringSchema,
  artists: z.array(stringSchema),
});

export type AlbumResponse = z.infer<typeof albumResponseSchema>;

export const artistResponseSchema = z.object({
  id: z.number(),
  name: stringSchema,
  album_cover: stringSchema,
});

export type ArtistResponse = z.infer<typeof artistResponseSchema>;