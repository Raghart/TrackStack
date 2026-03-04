import { getAlbums } from "@/queries/DetailQueries";
import { useQuery } from "@apollo/client";
import { useState } from "react";

const useGetAlbumCards = () => {
    const [page, setPage] = useState<number>(1);
    const [seed] = useState(Math.random().toString().slice());
    const { data, fetchMore } = useQuery(getAlbums, {
        variables: { seed, page: 1, limit: 20 },
        notifyOnNetworkStatusChange: true,
    });

    const onLoadMore = () => {
        const nextPage = page + 1;
        fetchMore({ variables: { page: nextPage, limit: 20, } })
        setPage(nextPage);
    };

    return { data, onLoadMore }
};

export default useGetAlbumCards;