import { getAlbums } from "@/queries/DetailQueries";
import { useQuery } from "@apollo/client";
import { albumResponseSchema } from "@trackstack/schemas";
import { useState } from "react";
import { parseArrayOrEmpty } from "../safeParse";
import { positiveIntSchema } from "@trackstack/schemas/zod.parsers";

const useGetAlbumCards = () => {
    const [page, setPage] = useState<number>(1);
    const [seed] = useState(Math.random().toString().slice(2));
    const { data, fetchMore } = useQuery(getAlbums, {
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

    const parsedData = parseArrayOrEmpty(albumResponseSchema, data?.getAlbums);
    const hasData = parsedData.length > 0;

    return { data: parsedData, onLoadMore, hasData }
};

export default useGetAlbumCards;