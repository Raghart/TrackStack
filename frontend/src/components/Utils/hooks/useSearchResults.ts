import { useLazyQuery } from "@apollo/client";
import { useAppDispatch } from "../redux-hooks";
import { useCallback, useMemo, useState } from "react";
import { debounce } from "lodash";
import { clearQuery, setIsLoading, setQuery, setQueryResults } from "@/reducers/searchReducer";
import { multipleSearch } from "@/queries/MultipleSearchQuerie";
import { multipleSearchResultsSchema } from "@trackstack/schemas";

const useSearchResults = () => {
    const [getResults] = useLazyQuery(multipleSearch);
    const [localQuery, setLocalQuery] = useState<string>("");
    const dispatch = useAppDispatch();

    const search = useCallback(async (query: string) => {
        if (!query.trim()) {
            dispatch(clearQuery());
            return;
        };

        dispatch(setQuery(query));
        dispatch(setIsLoading(true));

        try {
            const { data } = await getResults({ variables: { query } });
            const result = multipleSearchResultsSchema.safeParse(data?.multipleSearch);
            if (result.success) {
                dispatch(setQueryResults(result.data));
            };
        } catch {
            dispatch(setIsLoading(false));
        }
    },[dispatch,getResults]);

    const debouncedSearch = useMemo(() => debounce(search, 400),[search]);

    const handleQuery = (query: string) => debouncedSearch(query);

    const handleQueryChange = (query: string) => {
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