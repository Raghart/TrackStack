import z from "zod";
import { durationSchema, httpUrlSchema, positiveIntSchema, spotifyIdSchema, stringSchema, yearSchema } from "./zod.parsers";

const songDetailsSchema = z.object({
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

export const albumReferenceSchema = z.looseObject({
  id: positiveIntSchema.optional(),
  name: stringSchema.optional(),
  url_image: httpUrlSchema,
});

export const artistReferenceSchema = z.looseObject({
  id: positiveIntSchema.optional(),
  name: stringSchema,
});

export const genreReferenceSchema = z.looseObject({
  id: positiveIntSchema.optional(),
  genre: stringSchema,
});

export const songSchema = z.looseObject({
  id: positiveIntSchema,
  name: stringSchema,
  spotify_id: spotifyIdSchema.optional(),
  url_preview: httpUrlSchema,
  duration: durationSchema.optional(),
  year: yearSchema.optional(),
  album_id: positiveIntSchema.optional(),
  artists: z.array(artistReferenceSchema).optional(),
  album: albumReferenceSchema.optional(),
  genres: z.array(genreReferenceSchema).optional(),
  songDetails: songDetailsSchema.optional(),
});