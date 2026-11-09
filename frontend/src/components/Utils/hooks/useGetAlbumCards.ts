import { getAlbums } from "@/queries/DetailQueries";
import { useQuery } from "@apollo/client";
import { albumResponseSchema } from "@trackstack/schemas";
import { useState } from "react";

const useGetAlbumCards = () => {
    const [page, setPage] = useState<number>(1);
    const [seed] = useState(Math.random().toString().slice(2));
    const { data, fetchMore } = useQuery(getAlbums, {
        variables: { seed, page: 1, limit: 20 },
        notifyOnNetworkStatusChange: true,
    });

    const onLoadMore = () => {
        const nextPage = page + 1;
        fetchMore({ variables: { page: nextPage, limit: 20, } })
        setPage(nextPage);
    };

    const parsedData = data?.getAlbums ? 
        albumResponseSchema.array().parse(data.getAlbums) : undefined;
    const dataLength = parsedData ? data.getAlbums.length : 20;

    return { data: parsedData, onLoadMore, dataLength }
};

export default useGetAlbumCards;