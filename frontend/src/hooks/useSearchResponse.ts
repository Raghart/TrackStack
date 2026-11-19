import { useEffect, useState } from "react";
import { multipleSearchResults } from "@trackstack/schemas";
import { useAppSelector } from "@/Utils/redux-hooks";

const useSearchResponse = () => {
    const { query, isLoading, results, status } = useAppSelector(state => state.search);
    const [prevResults, setPrevResults] = useState<multipleSearchResults | null>(null);
    
    useEffect(() => { if(results) setPrevResults(results); },[results]);

    const canShowResults = status === "success" || status === "loading";
    const searchResults = canShowResults ? results || prevResults : null;

    return { query, isLoading, searchResults, status }
};

export default useSearchResponse;