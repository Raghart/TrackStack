import { useState } from "react";
import { genreList } from "../genreIconList";

const useGenreSel = () => {
    const [visibleCount, setVisibleCount] = useState<number>(20);
    const visibleGenres = genreList.slice(0, visibleCount);

    const loadMoreGenres = () => {
        if (visibleGenres.length < genreList.length) {
            setVisibleCount(prev => prev + 20);
        };
    };

    return { visibleGenres, loadMoreGenres };
};

export default useGenreSel;