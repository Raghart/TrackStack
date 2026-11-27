import { useAppSelector } from "@/Utils/redux-hooks";
import { SongResponse } from "@trackstack/schemas";
import { useState } from "react";

const PAGE_SIZE = 20;

const useRecommendationsList = () => {
    const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
    const recommendations = useAppSelector(state => state.songData.results);
    const visibleSongs: SongResponse[] = recommendations.slice(0, visibleCount);

    const loadMoreSongs = () => {
        if (visibleSongs.length < recommendations.length) {
            setVisibleCount(prev => prev + PAGE_SIZE);
        };
    };

    return { visibleSongs, recommendations, loadMoreSongs };
};

export default useRecommendationsList;
