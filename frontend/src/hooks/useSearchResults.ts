import { useLazyQuery } from "@apollo/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import { clearQuery, setIsLoading, setQuery, setQueryResults, setSearchError } from "@/reducers/searchReducer";
import { multipleSearch } from "@/queries/MultipleSearchQuerie";
import { multipleSearchResultsSchema } from "@trackstack/schemas";
import { searchQuerySchema } from "@trackstack/schemas/zod.parsers";
import { SearchFailureStatus } from "@/types/searchTypes";
import { toaster } from "@/components/ui/toasterInstance";
import { getSearchErrorMessage } from "@/Utils/searchErrorMessages";
import { useAppDispatch } from "@/Utils/redux-hooks";
import { parseDataOrUndefined } from "@/Utils/safeParse";

const useSearchResults = () => {
    const [getResults] = useLazyQuery(multipleSearch);
    const [localQuery, setLocalQuery] = useState<string>("");
    const dispatch = useAppDispatch();
    const requestIdRef = useRef(0);
    const lastErrorRef = useRef<string | null>(null);

    const notifySearchError = useCallback((status: SearchFailureStatus, query: string) => {
        const failureKey = `${status}:${query}`;
        if (lastErrorRef.current === failureKey) return;

        lastErrorRef.current = failureKey;
        toaster.create({
            type: "error",
            ...getSearchErrorMessage(status),
            meta: { closable: true },
        });
    }, []);

    const search = useCallback(async (rawQuery: unknown) => {
        if (typeof rawQuery !== "string") return;

        const normalizedQuery = rawQuery.trim();
        if (!normalizedQuery) {
            requestIdRef.current += 1;
            lastErrorRef.current = null;
            dispatch(clearQuery());
            return;
        }

        const query = parseDataOrUndefined(searchQuerySchema, normalizedQuery);
        if (!query) {
            requestIdRef.current += 1;
            lastErrorRef.current = null;
            dispatch(clearQuery());
            return;
        }

        const requestId = ++requestIdRef.current;

        dispatch(setQuery(query));
        dispatch(setIsLoading(true));

        try {
            const { data, error } = await getResults({ variables: { query } });
            if (requestId !== requestIdRef.current) return;
            if (error) throw error;

            const parsedData = parseDataOrUndefined(multipleSearchResultsSchema, data?.multipleSearch);
            if (!parsedData) {
                dispatch(setSearchError("invalid-payload"));
                notifySearchError("invalid-payload", query);
                return;
            }

            lastErrorRef.current = null;
            dispatch(setQueryResults(parsedData));
        } catch (error) {
            if (requestId !== requestIdRef.current) return;

            console.error("Search request failed:", error);
            dispatch(setSearchError("network-error"));
            notifySearchError("network-error", query);
        } finally {
            if (requestId === requestIdRef.current) dispatch(setIsLoading(false));
        }
    }, [dispatch, getResults, notifySearchError]);

    const debouncedSearch = useMemo(() => debounce(search, 400), [search]);

    useEffect(() => () => {
        debouncedSearch.cancel();
    }, [debouncedSearch]);

    const handleQuery = (query: string) => debouncedSearch(query);

    const handleQueryChange = (query: unknown) => {
        if (typeof query !== "string") return;
        handleQuery(query);
        setLocalQuery(query);
    };

    const clearSearch = () => {
        debouncedSearch.cancel();
        requestIdRef.current += 1;
        lastErrorRef.current = null;
        dispatch(clearQuery());
        setLocalQuery("");
    };
    
    return { localQuery, handleQueryChange, clearSearch };
};

export default useSearchResults;