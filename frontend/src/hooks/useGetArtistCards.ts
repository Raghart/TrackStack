import { getAllArtists } from "@/queries/DetailQueries";
import { parseArrayOrEmpty } from "@/Utils/safeParse";
import { useQuery } from "@apollo/client";
import { artistResponseSchema } from "@trackstack/schemas";
import { useState } from "react";

const useGetArtistCards = () => {
    const [page, setPage] = useState<number>(1);
    const [seed] = useState(Math.random().toString().slice(2));
    const { data, fetchMore } = useQuery(getAllArtists, {
        variables: { seed, page: 1, limit: 20 },
        notifyOnNetworkStatusChange: true,
    });
    
    const onLoadMore = () => {
        const nextPage = page + 1;
        fetchMore({ variables: { page: nextPage, limit: 20 } });
        setPage(nextPage);
    };

    const parsedData = parseArrayOrEmpty(artistResponseSchema, data?.getAllArtists);
    const hasData = parsedData.length > 0;

    return { data: parsedData, onLoadMore, hasData }
};

export default useGetArtistCards;