import { SearchFailureStatus, SearchInitialState } from "@/types/searchTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { multipleSearchResults } from "@trackstack/schemas";

const hasAnyResult = ({ artistResults, albumResults, songResults }: multipleSearchResults) =>
    artistResults.length > 0 || albumResults.length > 0 || songResults.length > 0;

const initialState : SearchInitialState = {
    results: null,
    query: "",
    isLoading: false,
    status: "idle",
    isMobileSearch: false,
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setQuery(state, action : PayloadAction<string>) {
            state.query = action.payload;
        },
        clearQuery(state) {
            state.query = "";
            state.results = null;
            state.isLoading = false;
            state.status = "idle";
            state.isMobileSearch = false;
        },
        setQueryResults(state, action : PayloadAction<multipleSearchResults>) {
            const isEmpty = !hasAnyResult(action.payload);
            state.results = isEmpty ? null : action.payload;
            state.isLoading = false;
            state.status = isEmpty ? "empty" : "success";
        },
        setSearchError(state, action : PayloadAction<SearchFailureStatus>) {
            state.results = null;
            state.isLoading = false;
            state.status = action.payload;
        },
        setIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
            if (action.payload) state.status = "loading";
        },
        setIsMobileSeach(state, action: PayloadAction<boolean>) {
            state.isMobileSearch = action.payload;
        },
    },
});

export const { setQuery, clearQuery, setQueryResults, setSearchError, setIsLoading, setIsMobileSeach } = searchSlice.actions;

export default searchSlice.reducer;