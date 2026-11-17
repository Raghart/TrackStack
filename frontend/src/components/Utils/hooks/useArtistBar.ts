import { getAllArtists } from "@/queries/DetailQueries";
import { useQuery } from "@apollo/client";
import { useBreakpointValue } from "@chakra-ui/react";
import { artistResponseSchema } from "@trackstack/schemas";
import { positiveIntSchema } from "@trackstack/schemas/zod.parsers";
import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";
import { parseArrayOrEmpty } from "../safeParse";

const useArtistBar = () => {
    const [page, setPageState] = useState<number>(1);
    const limit = useBreakpointValue({ base: 3, sm: 5, md: 7, lg: 10 });
    const [seed] = useState<string>(Math.floor(Math.random() * 1e15).toString());
    const { data } = useQuery(getAllArtists, {
        skip: !limit,
        variables: { seed, page, limit },
    });

    const setPage: Dispatch<SetStateAction<number>> = useCallback((nextPage) => {
        setPageState((currentPage) => {
            const candidate = typeof nextPage === "function" ? nextPage(currentPage) : nextPage;
            const parsedPage = positiveIntSchema.safeParse(candidate);
            return parsedPage.success ? parsedPage.data : currentPage;
        });
    }, []);

    const rawArtists = data?.getAllArtists;
    const artists = useMemo(
        () => parseArrayOrEmpty(artistResponseSchema, rawArtists),
        [rawArtists],
    );

    return { artists, page, setPage, limit };
};

export default useArtistBar;
