import { getAllGenres } from "@/queries/LandpageQueries";
import { useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";

const useGenreBtns = () => {
    const { data } = useQuery(getAllGenres);
    const genres: string[] = data?.getAllGenres || [];
    const scrollRef = useRef<HTMLDivElement>(null);
    const leftSentinel = useRef<HTMLDivElement>(null);
    const rightSentinel = useRef<HTMLDivElement>(null);
    const [atStart, setAtStart] = useState<boolean>(true);
    const [atEnd, setAtEnd] = useState<boolean>(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.target === leftSentinel.current) setAtStart(entry.isIntersecting);
                if (entry.target === rightSentinel.current) setAtEnd(entry.isIntersecting);
            },
            { root: scrollRef.current, threshold: 1.0}
        );

        if (leftSentinel.current) observer.observe(leftSentinel.current);
        if (rightSentinel.current) observer.observe(rightSentinel.current);

        return () => observer.disconnect();
    }, [])

    return { genres, atStart, atEnd, scrollRef, leftSentinel, rightSentinel };
    
};

export default useGenreBtns;