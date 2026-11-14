import { useLazyQuery } from "@apollo/client";
import { useAppDispatch } from "../redux-hooks";
import { useCallback, useMemo, useState } from "react";
import { debounce } from "lodash";
import { clearQuery, setIsLoading, setQuery, setQueryResults } from "@/reducers/searchReducer";
import { multipleSearch } from "@/queries/MultipleSearchQuerie";
import { multipleSearchResultsSchema } from "@trackstack/schemas";
import { parseDataOrUndefined } from "../safeParse";
import { searchQuerySchema } from "@trackstack/schemas/zod.parsers";

const useSearchResults = () => {
    const [getResults] = useLazyQuery(multipleSearch);
    const [localQuery, setLocalQuery] = useState<string>("");
    const dispatch = useAppDispatch();

    const search = useCallback(async (rawQuery: unknown) => {
        if (typeof rawQuery !== "string") return;

        if (!rawQuery.trim()) {
            dispatch(clearQuery());
            return;
        };

        const query = parseDataOrUndefined(searchQuerySchema, rawQuery);
        if (!query) return;

        dispatch(setQuery(query));
        dispatch(setIsLoading(true));

        try {
            const { data } = await getResults({ variables: { query } });
            const parsedData = parseDataOrUndefined(multipleSearchResultsSchema, data?.multipleSearch); 
            if (parsedData) {
                dispatch(setQueryResults(parsedData));
            };
        } catch {
            dispatch(setIsLoading(false));
        }
    },[dispatch,getResults]);

    const debouncedSearch = useMemo(() => debounce(search, 400),[search]);

    const handleQuery = (query: string) => debouncedSearch(query);

    const handleQueryChange = (query: unknown) => {
        if (typeof query !== "string") return;
        handleQuery(query);
        setLocalQuery(query);
    };

    const clearSearch = () => {
        dispatch(clearQuery());
        setLocalQuery("");
    };
    
    return { localQuery, handleQueryChange, clearSearch };
};

export default useSearchResults;