import { useState } from "react";
import { useAppSelector } from "../redux-hooks";

const useSongRec = () => {
    const [visibleCount, setVisibleCount] = useState<number>(20);
    const recommendations = useAppSelector(state => state.songData.results);
    const visibleSongs = recommendations.slice(0, visibleCount);

    const loadMoreSongs = () => {
        if (visibleSongs.length < recommendations.length) {
            setVisibleCount(prev => prev + 20);
        };
    };

    return { visibleSongs, loadMoreSongs };
};

export default useSongRec;