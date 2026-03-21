import { useEffect, useState } from "react";
import { useAppSelector } from "../redux-hooks";
import { MultipleSearchResult } from "@/types/searchTypes";

const useSearchResponse = () => {
    const { query, isLoading, results } = useAppSelector(state => state.search);
    const [prevResults, setPrevResults] = useState<MultipleSearchResult | null>(null);
    
    useEffect(() => { if(results) setPrevResults(results); },[results]);

    const searchResults = results || prevResults;

    return { query, isLoading, searchResults }
};

export default useSearchResponse;