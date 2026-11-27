import { getAlbums } from "@/queries/DetailQueries";
import { useQuery } from "@apollo/client";
import { albumResponseSchema } from "@trackstack/schemas";
import { useMemo, useState } from "react";
import { positiveIntSchema } from "@trackstack/schemas/zod.parsers";
import { parseArrayOrEmpty } from "@/Utils/safeParse";

const useGetAlbumCards = () => {
    const [page, setPage] = useState<number>(1);
    const [seed] = useState(() => Math.random().toString().slice(2));
    const { data, loading, fetchMore } = useQuery(getAlbums, {
        variables: { seed, page: 1, limit: 20 },
        notifyOnNetworkStatusChange: true,
    });

    const onLoadMore = () => {
        const nextPage = page + 1;
        const parsedPage = positiveIntSchema.safeParse(nextPage);
        if (!parsedPage.success) return;
        fetchMore({ variables: { page: parsedPage.data, limit: 20, } })
        setPage(nextPage);
    };

    const rawData = data?.getAlbums;
    const parsedData = useMemo(
        () => parseArrayOrEmpty(albumResponseSchema, rawData),
        [rawData],
    );

    return {
        data: parsedData,
        loading,
        onLoadMore,
        hasData: parsedData.length > 0,
    }
};

export default useGetAlbumCards;
