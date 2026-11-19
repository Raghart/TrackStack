import { getAllArtists } from "@/queries/DetailQueries";
import { useQuery } from "@apollo/client";
import { useBreakpointValue } from "@chakra-ui/react";
import { artistResponseSchema, type ArtistResponse } from "@trackstack/schemas";
import { positiveIntSchema } from "@trackstack/schemas/zod.parsers";
import {
    type Dispatch,
    type SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { parseArrayOrEmpty } from "../safeParse";

type ArtistPageCache = Map<string, ArtistResponse[]>;

const useArtistBar = () => {
    const [page, setPageState] = useState<number>(1);
    const [artistsPage, setArtistsPage] = useState<number>(1);
    const [pageCache, setPageCache] = useState<ArtistPageCache>(() => new Map());
    const limit = useBreakpointValue({ base: 3, sm: 5, md: 7, lg: 10 });
    const [seed] = useState<string>(Math.floor(Math.random() * 1e15).toString());
    const lastCachedPayload = useRef<unknown>(undefined);

    const pageKey = `${seed}:${limit ?? 0}:${page}`;
    const cachedArtists = pageCache.get(pageKey);

    const { data, previousData } = useQuery(getAllArtists, {
        skip: !limit || cachedArtists !== undefined,
        variables: { seed, page, limit },
        fetchPolicy: "no-cache",
    });

    const setPage: Dispatch<SetStateAction<number>> = useCallback((nextPage) => {
        setPageState((currentPage) => {
            const candidate = typeof nextPage === "function" ? nextPage(currentPage) : nextPage;
            const parsedPage = positiveIntSchema.safeParse(candidate);
            return parsedPage.success ? parsedPage.data : currentPage;
        });
    }, []);

    const rawArtists = data ? data.getAllArtists : previousData?.getAllArtists;
    const lastPayload = useRef(rawArtists);

    const nextArtists = useMemo(
        () => parseArrayOrEmpty(artistResponseSchema, rawArtists),
        [rawArtists],
    );

    useEffect(() => {
        if (!data || data === lastCachedPayload.current) return;

        lastCachedPayload.current = data;
        setPageCache((currentCache) => {
            if (currentCache.has(pageKey)) return currentCache;

            const nextCache = new Map(currentCache);
            nextCache.set(pageKey, nextArtists);
            return nextCache;
        });
    }, [data, pageKey, nextArtists]);

    useEffect(() => {
        if (rawArtists && rawArtists !== lastPayload.current) {
            lastPayload.current = rawArtists;
            setArtistsPage(page);
        }
    }, [rawArtists, page]);

    useEffect(() => {
        if (cachedArtists !== undefined) {
            setArtistsPage(page);
        }
    }, [cachedArtists, page]);

    const artists = cachedArtists ?? nextArtists;

    return { artists, page, artistsPage, setPage, limit };
};

export default useArtistBar;
