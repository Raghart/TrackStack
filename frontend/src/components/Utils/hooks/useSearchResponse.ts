import { useEffect, useState } from "react";
import { useAppSelector } from "../redux-hooks";
import { multipleSearchResults } from "@trackstack/schemas";

const useSearchResponse = () => {
    const { query, isLoading, results } = useAppSelector(state => state.search);
    const [prevResults, setPrevResults] = useState<multipleSearchResults | null>(null);
    
    useEffect(() => { if(results) setPrevResults(results); },[results]);

    const searchResults = results || prevResults;

    return { query, isLoading, searchResults }
};

export default useSearchResponse;