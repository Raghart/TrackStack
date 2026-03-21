import { useLazyQuery } from "@apollo/client";
import { useAppDispatch } from "../redux-hooks";
import { useCallback, useMemo, useState } from "react";
import { debounce } from "lodash";
import { clearQuery, setIsLoading, setQuery, setQueryResults } from "@/reducers/searchReducer";
import { multipleSearch } from "@/queries/MultipleSearchQuerie";

const useSearchResults = () => {
    const [getResults] = useLazyQuery(multipleSearch);
    const [localQuery, setLocalQuery] = useState<string>("");
    const dispatch = useAppDispatch();

    const search = useCallback((query: string) => {
        if (!query.trim()) {
            dispatch(clearQuery());
            return;
        };

        dispatch(setQuery(query));
        dispatch(setIsLoading(true));

        getResults({ variables: { query }, 
            onCompleted: (data) => {
                if (data.multipleSearch) {
                    dispatch(setQueryResults(data.multipleSearch));
                };
            },
        });
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