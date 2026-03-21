import { useState } from "react";
import { useAppSelector } from "../redux-hooks";
import { useQuery } from "@apollo/client";
import { getAllGenreSongs } from "@/queries/DetailQueries";
import { isString, isValidGenre } from "@/types/verify";

const useGenreSongs = (genre: string | undefined) => {
    const [page, setPage] = useState<number>(1);
    const [seed] = useState(Math.random().toString().slice(2));
    const { activeSong, isPlaying } = useAppSelector(state => state.songs.songState);

    const validGenre = isString(genre) && isValidGenre(genre);
    const genreKey = validGenre ? genre : "";

    const { loading, data, fetchMore } = useQuery(getAllGenreSongs, {
        variables: { seed, genre: genreKey, page: 1, limit: 20 },
        notifyOnNetworkStatusChange: true,
    });

    const loadMore = () => {
        const nextPage = page + 1;
        fetchMore({ variables: { genre, page: nextPage, limit: 20 } });
        setPage(nextPage);
    };

    return { data, loading, genreKey, loadMore, activeSong, isPlaying, validGenre }
};

export default useGenreSongs;