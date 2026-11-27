import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Pool } from 'pg';
import { resolveTestDbUrl } from './db.integration.variables';

describe('Docker test database integration', () => {
  let pool: Pool;

  beforeAll(() => {
    const connectionString = resolveTestDbUrl();
    pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 5_000,
      max: 4,
    });
  });

  afterAll(async () => {
    await pool?.end();
  });

  it('has required extensions, tables, and search functions', async () => {
    const extensions = await pool.query<{ extname: string }>(
      `SELECT extname
       FROM pg_extension
       WHERE extname = ANY($1::text[])
       ORDER BY extname`,
      [['pg_trgm', 'unaccent', 'vector']],
    );

    expect(extensions.rows.map((row) => row.extname)).toEqual([
      'pg_trgm',
      'unaccent',
      'vector',
    ]);

    const tables = await pool.query<{ tablename: string }>(
      `SELECT tablename
       FROM pg_tables
       WHERE schemaname = 'public'
         AND tablename = ANY($1::text[])
       ORDER BY tablename`,
      [
        [
          '_prisma_migrations',
          'albums',
          'artists',
          'genres',
          'song_artists',
          'song_details',
          'song_genres',
          'songs',
        ],
      ],
    );

    expect(tables.rows.map((row) => row.tablename)).toEqual([
      '_prisma_migrations',
      'albums',
      'artists',
      'genres',
      'song_artists',
      'song_details',
      'song_genres',
      'songs',
    ]);

    const functions = await pool.query<{ proname: string }>(
      `SELECT proname
       FROM pg_proc
       JOIN pg_namespace ON pg_namespace.oid = pg_proc.pronamespace
       WHERE pg_namespace.nspname = 'public'
         AND proname = ANY($1::text[])
       ORDER BY proname`,
      [
        [
          'immutable_unaccent',
          'search_albums',
          'search_artists',
          'search_songs',
          'search_songs_cosine_similarity',
        ],
      ],
    );

    expect(functions.rows.map((row) => row.proname)).toEqual([
      'immutable_unaccent',
      'search_albums',
      'search_artists',
      'search_songs',
      'search_songs_cosine_similarity',
    ]);
  });

  it('loads the demo seed with the expected row counts', async () => {
    const counts = await pool.query<{ table_name: string; count: string }>(
      `SELECT 'artists' AS table_name, COUNT(*)::text AS count FROM artists
       UNION ALL SELECT 'albums', COUNT(*)::text FROM albums
       UNION ALL SELECT 'genres', COUNT(*)::text FROM genres
       UNION ALL SELECT 'songs', COUNT(*)::text FROM songs
       UNION ALL SELECT 'song_details', COUNT(*)::text FROM song_details
       UNION ALL SELECT 'song_artists', COUNT(*)::text FROM song_artists
       UNION ALL SELECT 'song_genres', COUNT(*)::text FROM song_genres
       ORDER BY table_name`,
    );

    expect(counts.rows).toEqual([
      { table_name: 'albums', count: '76' },
      { table_name: 'artists', count: '57' },
      { table_name: 'genres', count: '67' },
      { table_name: 'song_artists', count: '100' },
      { table_name: 'song_details', count: '100' },
      { table_name: 'song_genres', count: '692' },
      { table_name: 'songs', count: '100' },
    ]);

    const vectors = await pool.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count
       FROM song_details
       WHERE vectors IS NOT NULL`,
    );

    expect(vectors.rows[0]?.count).toBe('100');
  });

  it('search_songs returns ranked real results from the seeded catalog', async () => {
    const exact = await pool.query<{
      id: number;
      name: string;
      artists: string[];
      album: string;
      album_cover: string;
      url_preview: string;
      match_rank: number;
      score: number;
    }>(`SELECT * FROM search_songs($1, $2)`, ['Come as You Are', 10]);

    expect(exact.rows.length).toBeGreaterThan(0);
    expect(exact.rows[0]).toMatchObject({
      name: 'Come as You Are',
      match_rank: 0,
    });
    expect(exact.rows[0]?.artists).toEqual(
      expect.arrayContaining(['Nirvana']),
    );
    expect(exact.rows[0]?.album.length).toBeGreaterThan(0);
    expect(exact.rows[0]?.album_cover).toMatch(/^https?:\/\//);
    expect(exact.rows[0]?.url_preview).toMatch(/^https?:\/\//);

    const fuzzy = await pool.query<{ name: string; match_rank: number }>(
      `SELECT name, match_rank FROM search_songs($1, $2)`,
      ['Com as You Are', 10],
    );

    expect(fuzzy.rows.some((row) => row.name === 'Come as You Are')).toBe(
      true,
    );
    expect(fuzzy.rows.every((row) => row.match_rank >= 0)).toBe(true);
  });

  it('search_artists and search_albums return real seeded matches', async () => {
    const artists = await pool.query<{
      name: string;
      album_cover: string;
      match_rank: number;
      score: number;
    }>(`SELECT name, album_cover, match_rank, score FROM search_artists($1, $2)`, [
      'Nirvana',
      10,
    ]);

    expect(artists.rows.length).toBeGreaterThan(0);
    expect(artists.rows[0]).toMatchObject({
      name: 'Nirvana',
      match_rank: 0,
    });
    expect(artists.rows[0]?.album_cover).toMatch(/^https?:\/\//);

    const albums = await pool.query<{
      name: string;
      artists: string[];
      album_cover: string;
      match_rank: number;
    }>(
      `SELECT name, artists, album_cover, match_rank FROM search_albums($1, $2)`,
      ['Nevermind', 10],
    );

    expect(albums.rows.length).toBeGreaterThan(0);
    expect(albums.rows[0]?.name).toContain('Nevermind');
    expect([0, 1]).toContain(albums.rows[0]?.match_rank);
    expect(albums.rows[0]?.artists.length).toBeGreaterThan(0);
    expect(albums.rows[0]?.album_cover).toMatch(/^https?:\/\//);
  });

  it('search_songs_cosine_similarity returns ordered results for a real vector', async () => {
    const seed = await pool.query<{ vectors: string }>(
      `SELECT vectors::text AS vectors
       FROM song_details
       WHERE vectors IS NOT NULL
       LIMIT 1`,
    );

    const vector = seed.rows[0]?.vectors;
    expect(vector).toBeTruthy();

    const result = await pool.query<{
      id: number;
      name: string;
      artists: string;
      url_preview: string;
      album_cover: string;
      cos_sim: number;
    }>(
      `SELECT id, name, artists, url_preview, album_cover, cos_sim
       FROM search_songs_cosine_similarity($1::text[], $2::vector, $3)`,
      [[], vector, 5],
    );

    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.rows.length).toBeLessThanOrEqual(5);

    for (const row of result.rows) {
      expect(row.id).toEqual(expect.any(Number));
      expect(row.name.length).toBeGreaterThan(0);
      expect(row.artists.length).toBeGreaterThan(0);
      expect(row.url_preview).toMatch(/^https?:\/\//);
      expect(row.album_cover).toMatch(/^https?:\/\//);
      expect(row.cos_sim).toBeGreaterThanOrEqual(-1);
      expect(row.cos_sim).toBeLessThanOrEqual(1.0001);
    }

    let previousCosSim = result.rows[0].cos_sim;
    for (const row of result.rows.slice(1)) {
      expect(previousCosSim).toBeGreaterThanOrEqual(row.cos_sim);
      previousCosSim = row.cos_sim;
    }
  });

  it('search_songs_cosine_similarity applies the genre filter', async () => {
    const seed = await pool.query<{ genre: string; vectors: string }>(
      `SELECT g.genre, sd.vectors::text AS vectors
       FROM song_details sd
       JOIN song_genres sg ON sg.song_id = sd.song_id
       JOIN genres g ON g.id = sg.genre_id
       WHERE sd.vectors IS NOT NULL
       LIMIT 1`,
    );

    const genre = seed.rows[0]?.genre;
    const vector = seed.rows[0]?.vectors;
    expect(genre).toBeTruthy();
    expect(vector).toBeTruthy();

    const filtered = await pool.query<{ id: number }>(
      `SELECT id
       FROM search_songs_cosine_similarity($1::text[], $2::vector, $3)`,
      [[genre], vector, 10],
    );

    expect(filtered.rows.length).toBeGreaterThan(0);

    const matchingIds = await pool.query<{ id: number }>(
      `SELECT DISTINCT s.id
       FROM songs s
       JOIN song_genres sg ON sg.song_id = s.id
       JOIN genres g ON g.id = sg.genre_id
       WHERE s.id = ANY($1::int[])
         AND g.genre = $2`,
      [filtered.rows.map((row) => row.id), genre],
    );

    expect(matchingIds.rows.length).toBe(filtered.rows.length);
  });
});
