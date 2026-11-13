import { getAllGenres } from "@/queries/LandpageQueries";
import { useQuery } from "@apollo/client";
import { useRef, useState } from "react";
import { parseArrayOrEmpty } from "../safeParse";
import { stringSchema } from "../../../../../schemas/zod.parsers";

const useGenreBtns = () => {
    const { data } = useQuery(getAllGenres);
    const genres = parseArrayOrEmpty(stringSchema, data?.getAllGenres);
    const hasData = genres.length > 0;
    const scrollRef = useRef<HTMLDivElement>(null);
    const [atStart, setAtStart] = useState<boolean>(true);
    const [atEnd, setAtEnd] = useState<boolean>(false);

    const handleScroll = () => {
        const btnContainer = scrollRef.current;
        if (!btnContainer) return;

        const { scrollLeft, scrollWidth, clientWidth } = btnContainer;
        setAtStart(scrollLeft <= 0);
        setAtEnd(scrollLeft + clientWidth >= scrollWidth);
    };

    return { genres, hasData, atStart, atEnd, scrollRef, handleScroll }
};

export default useGenreBtns;