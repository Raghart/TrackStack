import { getAllArtists } from "@/queries/DetailQueries";
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

    const parsedData = data?.getAllArtists ? 
        artistResponseSchema.array().parse(data.getAllArtists) : undefined;
    const dataLength = parsedData ? data.getAllArtists.length : 20;

    return { data: parsedData, onLoadMore, dataLength }
};

export default useGetArtistCards;