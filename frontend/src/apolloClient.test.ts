import {
    ARTISTS_PAGE_LIMIT,
    artistIds,
    buildArtistsPage,
    readAllArtists,
    readArtists,
    writeArtistsPage,
} from "@/test/artistPaginationSetups";
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
