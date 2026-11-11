import { useState } from "react";
import { useAppSelector } from "../redux-hooks";
import { useQuery } from "@apollo/client";
import { getAllGenreSongs } from "@/queries/DetailQueries";
import { songResponseSchema } from "@trackstack/schemas";
import { parseArrayOrEmpty } from "../safeParse";

const useGenreSongs = (genre: string) => {
    const [page, setPage] = useState<number>(1);
    const [seed] = useState(Math.random().toString().slice(2));
    const { activeSong, isPlaying } = useAppSelector(state => state.songs.songState);

    const { loading, data, fetchMore } = useQuery(getAllGenreSongs, {
        variables: { seed, genre, page: 1, limit: 20 },
        notifyOnNetworkStatusChange: true,
    });

    const loadMore = () => {
        const nextPage = page + 1;
        fetchMore({ variables: { genre, page: nextPage, limit: 20 } });
        setPage(nextPage);
    };

    const parsedData = parseArrayOrEmpty(songResponseSchema, data?.getAllGenreSongs);
    const hasData = parsedData.length > 0;

    return { data: parsedData, loading, genre, loadMore, activeSong, isPlaying, hasData }
};

export default useGenreSongs;