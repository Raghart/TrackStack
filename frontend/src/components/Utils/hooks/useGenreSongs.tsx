import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { getAllGenreSongs } from "@/queries/DetailQueries";
import { songResponseSchema } from "@trackstack/schemas";
import { positiveIntSchema } from "@trackstack/schemas/zod.parsers";
import { parseArrayOrEmpty } from "../safeParse";

const useGenreSongs = (genre: string) => {
    const [pagination, setPagination] = useState<{ genre: string; page: number }>({
        genre,
        page: 1,
    });
    const [seed] = useState(() => Math.random().toString().slice(2));

    const { loading, data, fetchMore } = useQuery(getAllGenreSongs, {
        variables: { seed, genre, page: 1, limit: 20 },
        notifyOnNetworkStatusChange: true,
    });

    const page = pagination.genre === genre ? pagination.page : 1;

    const loadMore = () => {
        const nextPage = page + 1;
        const parsedPage = positiveIntSchema.safeParse(nextPage);
        if (!parsedPage.success) return;
        fetchMore({ variables: { genre, page: parsedPage.data, limit: 20 } });
        setPagination({ genre, page: nextPage });
    };

    const rawData = data?.getAllGenreSongs;
    const parsedData = useMemo(
        () => parseArrayOrEmpty(songResponseSchema, rawData),
        [rawData],
    );

    return {
        data: parsedData,
        loading,
        loadMore,
        hasData: parsedData.length > 0,
    }
};

export default useGenreSongs;
