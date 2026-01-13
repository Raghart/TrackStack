import { SongResponse } from "@/types/songTypes";
import { useState } from "react";

const usePaginateSongs = (songs: SongResponse[]) => {
    const [visibleCount, setVisibleCount] = useState<number>(20);
    const visibleSongs = songs.slice(0, visibleCount);
    const loadMoreSongs = () => {
        if (visibleSongs.length < songs.length) {
            setVisibleCount(prev => prev + 20);
        } 
    }

    return { visibleSongs, loadMoreSongs }
};

export default usePaginateSongs;