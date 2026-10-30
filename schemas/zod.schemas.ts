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

export const stringArraySchema = z.array(stringSchema);

export const numberArraySchema = z.array(floatNumberSchema);

/* -------------------------------------------------------------------------- */
/* Entidades anidadas                                                          */
/* -------------------------------------------------------------------------- */

/** `SongDetailsModel` tal y como se expone en las respuestas. */
export const songDetailsSchema = z.looseObject({
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

/** `AlbumsModel` cuando se incluye dentro de una canción (solo `url_image` garantizado). */
export const albumReferenceSchema = z.looseObject({
  id: z.number().optional(),
  name: stringSchema.optional(),
  url_image: stringSchema,
});

/** `ArtistsModel` cuando se incluye dentro de una canción (solo `name` garantizado). */
export const artistReferenceSchema = z.looseObject({
  id: z.number().optional(),
  name: stringSchema,
});

/** `GenresModel` cuando se incluye dentro de una canción (solo `genre` garantizado). */
export const genreReferenceSchema = z.looseObject({
  id: z.number().optional(),
  genre: stringSchema,
});

/** `SongsModel` con las relaciones que pueden venir precargadas. */
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

/* -------------------------------------------------------------------------- */
/* Schemas de las funciones `parse*`                                           */
/* -------------------------------------------------------------------------- */

/** Equivale a `parseAlbumSong`: álbum con al menos una canción. */
export const albumWithSongsSchema = z.looseObject({
  id: z.number(),
  name: stringSchema,
  url_image: stringSchema,
  songs: z.array(songSchema).min(1),
});

/** Equivale a `parseArtistSongs`: artista con al menos una canción. */
export const artistWithSongsSchema = z.looseObject({
  id: z.number(),
  name: stringSchema,
  songs: z.array(songSchema).min(1),
});

/** Equivale a `parseSongGenres`: fila `song_genres` con `song` y `genre` precargados. */
export const songGenresWithSongsSchema = z.looseObject({
  id: z.number(),
  song_id: z.number(),
  genre_id: z.number(),
  song: songSchema,
  genre: genreReferenceSchema,
});

/** Equivale a `parseSongResponse`: canción con artistas y álbum. */
export const songResponseSchema = z.looseObject({
  id: z.number(),
  name: stringSchema,
  url_preview: stringSchema,
  artists: z.array(artistReferenceSchema),
  album: albumReferenceSchema,
});

/**
 * Equivale a `parseFullSongResponse`: canción completa con artistas, álbum y
 * géneros. `id` es opcional porque el guard actual no lo exige.
 */
export const fullSongResponseSchema = z.looseObject({
  id: z.number().optional(),
  name: stringSchema,
  spotify_id: stringSchema,
  url_preview: stringSchema,
  duration: z.number(),
  year: z.number(),
  artists: z.array(artistReferenceSchema),
  album: albumReferenceSchema,
  genres: z.array(genreReferenceSchema),
});

/** Elemento de `parseSongRecommendations` (`SongRecResponse`). */
export const songRecommendationSchema = z.looseObject({
  id: z.number(),
  name: stringSchema,
  artists: stringSchema,
  album_cover: stringSchema,
  url_preview: stringSchema,
  cos_sim: z.number(),
});

/** Equivale a `parseSongRecommendations`: lista de recomendaciones. */
export const songRecommendationsSchema = z.array(songRecommendationSchema);

/** Equivale a `parseArtistSearchData` (`artistSearchResults`). */
export const artistSearchResultSchema = z.looseObject({
  id: z.number(),
  name: stringSchema,
  album_cover: stringSchema,
  type: z.literal('artist'),
});

/** Equivale a `parseAlbumSearchData` (`albumSearchResults`). */
export const albumSearchResultSchema = z.looseObject({
  id: z.number(),
  name: stringSchema,
  artists: z.array(stringSchema),
  album_cover: stringSchema,
  type: z.literal('album'),
});

/** Equivale a `parseSongSearchData` (`songSearchResults`). */
export const songSearchResultSchema = z.looseObject({
  id: z.number(),
  name: stringSchema,
  artists: z.array(stringSchema),
  album: stringSchema,
  album_cover: stringSchema,
  url_preview: stringSchema,
  type: z.literal('song'),
});
