import { z } from 'zod';
import { durationSchema, floatNumberSchema, httpUrlSchema, limitSchema, positiveIntSchema, spotifyIdSchema, stringSchema, yearSchema } from './zod.parsers';
import { albumReferenceSchema, artistReferenceSchema, genreReferenceSchema, songSchema } from './zod.dbSchemas';
import { USER_VECTOR_LENGTH } from './zod.contants';

export const artistSearchResultSchema = z.looseObject({
  id: positiveIntSchema,
  name: stringSchema,
  album_cover: httpUrlSchema,
  type: z.literal('artist'),
});

export type ArtistSearchResultData = z.infer<typeof artistSearchResultSchema>;

export const albumSearchResultSchema = z.looseObject({
  id: positiveIntSchema,
  name: stringSchema,
  artists: z.array(stringSchema),
  album_cover: httpUrlSchema,
  type: z.literal('album'),
});

export type AlbumSearchResultData = z.infer<typeof albumSearchResultSchema>;

export const songSearchResultSchema = z.looseObject({
  id: positiveIntSchema,
  name: stringSchema,
  artists: z.array(stringSchema),
  album: stringSchema,
  album_cover: httpUrlSchema,
  url_preview: httpUrlSchema,
  type: z.literal('song'),
});

export type SongSearchResultData = z.infer<typeof songSearchResultSchema>;

export const multipleSearchResultsSchema = z.object({
  artistResults: z.array(artistSearchResultSchema),
  albumResults: z.array(albumSearchResultSchema),
  songResults: z.array(songSearchResultSchema),
});

export type multipleSearchResults = z.infer<typeof multipleSearchResultsSchema>;

export const songRawSchema = z.looseObject({
  id: positiveIntSchema,
  name: stringSchema,
  url_preview: httpUrlSchema,
  artists: z.array(artistReferenceSchema),
  album: albumReferenceSchema,
});

export type SongRawData = z.infer<typeof songRawSchema>;

export const songResponseSchema = z.object({
  id: floatNumberSchema,
  name: stringSchema,
  artists: z.array(stringSchema),
  album_cover: httpUrlSchema,
  url_preview: httpUrlSchema,
});

export type SongResponse = z.infer<typeof songResponseSchema>;

export const albumWithSongsSchema = z.object({
  id: positiveIntSchema,
  name: stringSchema,
  url_image: httpUrlSchema,
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
  spotify_id: spotifyIdSchema,
  url_preview: httpUrlSchema,
  duration: floatNumberSchema,
  year: yearSchema,
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
  album_cover: httpUrlSchema,
  duration: durationSchema,
  year: yearSchema,
  spotify_id: spotifyIdSchema,
  url_preview: httpUrlSchema,
});

export type FullSongResponse = z.infer<typeof fullSongResponseSchema>;

export const songRawRecommendationSchema = z.object({
  id: positiveIntSchema,
  name: stringSchema,
  artists: stringSchema,
  album_cover: httpUrlSchema,
  url_preview: httpUrlSchema,
  cos_sim: z.number(),
});

export type SongRawRecommendation = z.infer<typeof songRawRecommendationSchema>;

export const albumResponseSchema = z.object({
  id: positiveIntSchema,
  name: stringSchema,
  album_cover: httpUrlSchema,
  artists: z.array(stringSchema),
});

export type AlbumResponse = z.infer<typeof albumResponseSchema>;

export const artistResponseSchema = z.object({
  id: positiveIntSchema,
  name: stringSchema,
  album_cover: httpUrlSchema,
});

export type ArtistResponse = z.infer<typeof artistResponseSchema>;

export const paginationSchema = z.object({
  page: positiveIntSchema,
  limit: limitSchema,
});

export type PaginationVariables = z.infer<typeof paginationSchema>;

export const userVectorSchema = z
  .tuple([
    z.number().min(0).max(1),
    z.number().min(0).max(1.5),
    z.number().min(0).max(1),
    z.number().min(0).max(1.2),
    z.number().min(0).max(1.5),
    z.number().min(0).max(1.3),
    z.number().min(0).max(1.2),
    z.number().min(0).max(1.2),
  ])
  .describe(
    `exactly ${USER_VECTOR_LENGTH} finite values in the ranges produced by generateUserVector`,
  );

export type UserVector = z.infer<typeof userVectorSchema>;

export const recommendationRequestSchema = z.object({
  genres: z.array(stringSchema),
  userVector: userVectorSchema,
  limit: limitSchema,
});

export type RecommendationRequestVariables = z.infer<
  typeof recommendationRequestSchema
>;
