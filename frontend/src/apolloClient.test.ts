import {
    ALBUMS_PAGE_LIMIT,
    albumIds,
    buildAlbumsPage,
    readAlbums,
    readAllAlbums,
    writeAlbumsPage,
} from "@/test/albumPaginationSetups";
import {
    ARTISTS_PAGE_LIMIT,
    artistIds,
    buildArtistsPage,
    readAllArtists,
    readArtists,
    writeArtistsPage,
} from "@/test/artistPaginationSetups";
import {
    DEFAULT_GENRE,
    GENRE_SONGS_PAGE_LIMIT,
    buildGenreSongsPage,
    genreSongIds,
    readAllGenreSongs,
    readGenreSongs,
    writeGenreSongsPage,
} from "@/test/genrePaginationSetups";
import { createCache } from "./apolloClient";
import { InMemoryCache } from "@apollo/client";

describe("Apollo cache · getAllArtists", () => {
    let cache: InMemoryCache;

    beforeEach(() => {
        cache = createCache();
    });

    it("has no cached list before any page is written", () => {
        expect(readArtists(cache)).toBeUndefined();
    });

    it("stores the first page as is", () => {
        const page = writeArtistsPage(cache, 1);

        expect(artistIds(readAllArtists(cache))).toEqual(artistIds(page));
    });

    it("appends the next page without losing or duplicating artists", () => {
        const firstPage = writeArtistsPage(cache, 1);
        const secondPage = writeArtistsPage(cache, 2);

        const merged = readAllArtists(cache);

        expect(merged).toHaveLength(firstPage.length + secondPage.length);
        expect(artistIds(merged)).toEqual([...artistIds(firstPage), ...artistIds(secondPage)]);
        expect(new Set(artistIds(merged)).size).toBe(merged.length);
    });

    it("keeps the full list after loading several pages in order", () => {
        writeArtistsPage(cache, 1);
        writeArtistsPage(cache, 2);
        writeArtistsPage(cache, 3);

        const merged = readAllArtists(cache);

        expect(merged).toHaveLength(ARTISTS_PAGE_LIMIT * 3);
        expect(artistIds(merged)).toEqual(
            Array.from({ length: ARTISTS_PAGE_LIMIT * 3 }, (_, index) => index + 1),
        );
    });

    it("replaces a page instead of duplicating it when it is fetched again", () => {
        writeArtistsPage(cache, 1);
        writeArtistsPage(cache, 2);
        const refreshedPage = writeArtistsPage(cache, 2);

        const merged = readAllArtists(cache);

        expect(merged).toHaveLength(ARTISTS_PAGE_LIMIT * 2);
        expect(artistIds(merged)).toEqual(
            Array.from({ length: ARTISTS_PAGE_LIMIT * 2 }, (_, index) => index + 1),
        );
        expect(new Set(artistIds(merged)).size).toBe(merged.length);
        expect(artistIds(merged).slice(ARTISTS_PAGE_LIMIT)).toEqual(artistIds(refreshedPage));
    });

    it("updates stale artists in the middle of the list when a page is refreshed", () => {
        writeArtistsPage(cache, 1);
        const refreshedPage = buildArtistsPage(2).map((artist, index) =>
            index === 0 ? { ...artist, name: "Refreshed artist" } : artist,
        );
        writeArtistsPage(cache, 2, { artists: refreshedPage });

        const merged = readAllArtists(cache);

        expect(merged).toHaveLength(ARTISTS_PAGE_LIMIT * 2);
        expect(merged.at(ARTISTS_PAGE_LIMIT)?.name).toBe("Refreshed artist");
        expect(merged.at(0)?.name).toBe("Artist 1");
    });

    it("keeps a shorter last page at the end of the list", () => {
        writeArtistsPage(cache, 1);
        writeArtistsPage(cache, 2);
        writeArtistsPage(cache, 3, { count: 5 });

        const merged = readAllArtists(cache);

        expect(merged).toHaveLength(ARTISTS_PAGE_LIMIT * 2 + 5);
        expect(artistIds(merged).at(-1)).toBe(ARTISTS_PAGE_LIMIT * 2 + 5);
    });

    it("ignores the seed when reading because the field is not keyed by args", () => {
        writeArtistsPage(cache, 1, { seed: "seed-a" });
        writeArtistsPage(cache, 2, { seed: "seed-a" });

        const merged = readArtists(cache, {
            seed: "seed-b",
            page: 1,
            limit: ARTISTS_PAGE_LIMIT,
        });

        expect(artistIds(merged ?? [])).toEqual(
            Array.from({ length: ARTISTS_PAGE_LIMIT * 2 }, (_, index) => index + 1),
        );
    });

    it("computes the page offset from the requested limit", () => {
        writeArtistsPage(cache, 1, { limit: 10 });
        writeArtistsPage(cache, 2, { limit: 10 });

        const merged = readArtists(cache, { seed: "seed", page: 1, limit: 10 });

        expect(artistIds(merged ?? [])).toEqual(
            Array.from({ length: 20 }, (_, index) => index + 1),
        );
    });
});

describe("Apollo cache · getAlbums", () => {
    let cache: InMemoryCache;

    beforeEach(() => {
        cache = createCache();
    });

    it("has no cached list before any page is written", () => {
        expect(readAlbums(cache)).toBeUndefined();
    });

    it("stores the first page as is", () => {
        const page = writeAlbumsPage(cache, 1);

        expect(albumIds(readAllAlbums(cache))).toEqual(albumIds(page));
    });

    it("appends the next page without losing or duplicating albums", () => {
        const firstPage = writeAlbumsPage(cache, 1);
        const secondPage = writeAlbumsPage(cache, 2);

        const merged = readAllAlbums(cache);

        expect(merged).toHaveLength(firstPage.length + secondPage.length);
        expect(albumIds(merged)).toEqual([...albumIds(firstPage), ...albumIds(secondPage)]);
        expect(new Set(albumIds(merged)).size).toBe(merged.length);
    });

    it("keeps the full list after loading several pages in order", () => {
        writeAlbumsPage(cache, 1);
        writeAlbumsPage(cache, 2);
        writeAlbumsPage(cache, 3);

        const merged = readAllAlbums(cache);

        expect(merged).toHaveLength(ALBUMS_PAGE_LIMIT * 3);
        expect(albumIds(merged)).toEqual(
            Array.from({ length: ALBUMS_PAGE_LIMIT * 3 }, (_, index) => index + 1),
        );
    });

    it("replaces a page instead of duplicating it when it is fetched again", () => {
        writeAlbumsPage(cache, 1);
        writeAlbumsPage(cache, 2);
        const refreshedPage = writeAlbumsPage(cache, 2);

        const merged = readAllAlbums(cache);

        expect(merged).toHaveLength(ALBUMS_PAGE_LIMIT * 2);
        expect(albumIds(merged)).toEqual(
            Array.from({ length: ALBUMS_PAGE_LIMIT * 2 }, (_, index) => index + 1),
        );
        expect(new Set(albumIds(merged)).size).toBe(merged.length);
        expect(albumIds(merged).slice(ALBUMS_PAGE_LIMIT)).toEqual(albumIds(refreshedPage));
    });

    it("updates stale albums in the middle of the list when a page is refreshed", () => {
        writeAlbumsPage(cache, 1);
        const refreshedPage = buildAlbumsPage(2).map((album, index) =>
            index === 0 ? { ...album, name: "Refreshed album" } : album,
        );
        writeAlbumsPage(cache, 2, { albums: refreshedPage });

        const merged = readAllAlbums(cache);

        expect(merged).toHaveLength(ALBUMS_PAGE_LIMIT * 2);
        expect(merged.at(ALBUMS_PAGE_LIMIT)?.name).toBe("Refreshed album");
        expect(merged.at(0)?.name).toBe("Album 1");
    });

    it("keeps a shorter last page at the end of the list", () => {
        writeAlbumsPage(cache, 1);
        writeAlbumsPage(cache, 2);
        writeAlbumsPage(cache, 3, { count: 5 });

        const merged = readAllAlbums(cache);

        expect(merged).toHaveLength(ALBUMS_PAGE_LIMIT * 2 + 5);
        expect(albumIds(merged).at(-1)).toBe(ALBUMS_PAGE_LIMIT * 2 + 5);
    });

    it("ignores the seed when reading because the field is not keyed by args", () => {
        writeAlbumsPage(cache, 1, { seed: "seed-a" });
        writeAlbumsPage(cache, 2, { seed: "seed-a" });

        const merged = readAlbums(cache, {
            seed: "seed-b",
            page: 1,
            limit: ALBUMS_PAGE_LIMIT,
        });

        expect(albumIds(merged ?? [])).toEqual(
            Array.from({ length: ALBUMS_PAGE_LIMIT * 2 }, (_, index) => index + 1),
        );
    });

    it("computes the page offset from the requested limit", () => {
        writeAlbumsPage(cache, 1, { limit: 10 });
        writeAlbumsPage(cache, 2, { limit: 10 });

        const merged = readAlbums(cache, { seed: "seed", page: 1, limit: 10 });

        expect(albumIds(merged ?? [])).toEqual(
            Array.from({ length: 20 }, (_, index) => index + 1),
        );
    });
});

describe("Apollo cache · getAllGenreSongs", () => {
    let cache: InMemoryCache;

    beforeEach(() => {
        cache = createCache();
    });

    it("has no cached list before any page is written", () => {
        expect(readGenreSongs(cache)).toBeUndefined();
    });

    it("stores the first page as is", () => {
        const page = writeGenreSongsPage(cache, 1);

        expect(genreSongIds(readAllGenreSongs(cache))).toEqual(genreSongIds(page));
    });

    it("appends the next page without losing or duplicating songs", () => {
        const firstPage = writeGenreSongsPage(cache, 1);
        const secondPage = writeGenreSongsPage(cache, 2);

        const merged = readAllGenreSongs(cache);

        expect(merged).toHaveLength(firstPage.length + secondPage.length);
        expect(genreSongIds(merged)).toEqual([
            ...genreSongIds(firstPage),
            ...genreSongIds(secondPage),
        ]);
        expect(new Set(genreSongIds(merged)).size).toBe(merged.length);
    });

    it("keeps the full list after loading several pages in order", () => {
        writeGenreSongsPage(cache, 1);
        writeGenreSongsPage(cache, 2);
        writeGenreSongsPage(cache, 3);

        const merged = readAllGenreSongs(cache);

        expect(merged).toHaveLength(GENRE_SONGS_PAGE_LIMIT * 3);
        expect(genreSongIds(merged)).toEqual(
            Array.from({ length: GENRE_SONGS_PAGE_LIMIT * 3 }, (_, index) => index + 1),
        );
    });

    it("replaces a page instead of duplicating it when it is fetched again", () => {
        writeGenreSongsPage(cache, 1);
        writeGenreSongsPage(cache, 2);
        const refreshedPage = writeGenreSongsPage(cache, 2);

        const merged = readAllGenreSongs(cache);

        expect(merged).toHaveLength(GENRE_SONGS_PAGE_LIMIT * 2);
        expect(genreSongIds(merged)).toEqual(
            Array.from({ length: GENRE_SONGS_PAGE_LIMIT * 2 }, (_, index) => index + 1),
        );
        expect(new Set(genreSongIds(merged)).size).toBe(merged.length);
        expect(genreSongIds(merged).slice(GENRE_SONGS_PAGE_LIMIT)).toEqual(
            genreSongIds(refreshedPage),
        );
    });

    it("updates stale songs in the middle of the list when a page is refreshed", () => {
        writeGenreSongsPage(cache, 1);
        const refreshedPage = buildGenreSongsPage(2).map((song, index) =>
            index === 0 ? { ...song, name: "Refreshed song" } : song,
        );
        writeGenreSongsPage(cache, 2, { songs: refreshedPage });

        const merged = readAllGenreSongs(cache);

        expect(merged).toHaveLength(GENRE_SONGS_PAGE_LIMIT * 2);
        expect(merged.at(GENRE_SONGS_PAGE_LIMIT)?.name).toBe("Refreshed song");
        expect(merged.at(0)?.name).toBe("Song 1");
    });

    it("keeps a shorter last page at the end of the list", () => {
        writeGenreSongsPage(cache, 1);
        writeGenreSongsPage(cache, 2);
        writeGenreSongsPage(cache, 3, { count: 1 });

        const merged = readAllGenreSongs(cache);

        expect(merged).toHaveLength(GENRE_SONGS_PAGE_LIMIT * 2 + 1);
        expect(genreSongIds(merged).at(-1)).toBe(GENRE_SONGS_PAGE_LIMIT * 2 + 1);
    });

    it("keeps each genre in its own paginated list", () => {
        writeGenreSongsPage(cache, 1, { genre: DEFAULT_GENRE });
        writeGenreSongsPage(cache, 1, { genre: "Art Rock", songs: [
            { ...buildGenreSongsPage(1)[0], id: 101, name: "Art song" },
        ] });

        expect(genreSongIds(readAllGenreSongs(cache, DEFAULT_GENRE))).toEqual([1, 2]);
        expect(genreSongIds(readAllGenreSongs(cache, "Art Rock"))).toEqual([101]);
    });

    it("fills only the slots of the requested genre when another genre already has pages", () => {
        writeGenreSongsPage(cache, 1, { genre: DEFAULT_GENRE });
        writeGenreSongsPage(cache, 1, { genre: "Art Rock" });
        writeGenreSongsPage(cache, 2, { genre: "Art Rock" });
        writeGenreSongsPage(cache, 2, { genre: DEFAULT_GENRE });

        expect(genreSongIds(readAllGenreSongs(cache, DEFAULT_GENRE))).toEqual([1, 2, 3, 4]);
        expect(genreSongIds(readAllGenreSongs(cache, "Art Rock"))).toEqual([1, 2, 3, 4]);
    });

    it("keeps the paginated list when the seed changes because only the genre keys the field", () => {
        writeGenreSongsPage(cache, 1, { seed: "seed-a" });
        writeGenreSongsPage(cache, 2, { seed: "seed-b" });

        const merged = readGenreSongs(cache, {
            seed: "seed-c",
            genre: DEFAULT_GENRE,
            page: 1,
            limit: GENRE_SONGS_PAGE_LIMIT,
        });

        expect(genreSongIds(merged ?? [])).toEqual(
            Array.from({ length: GENRE_SONGS_PAGE_LIMIT * 2 }, (_, index) => index + 1),
        );
    });

    it("computes the page offset from the requested limit", () => {
        writeGenreSongsPage(cache, 1, { limit: 10 });
        writeGenreSongsPage(cache, 2, { limit: 10 });

        const merged = readGenreSongs(cache, {
            seed: "seed",
            genre: DEFAULT_GENRE,
            page: 1,
            limit: 10,
        });

        expect(genreSongIds(merged ?? [])).toEqual(
            Array.from({ length: 20 }, (_, index) => index + 1),
        );
    });
});
