import { MultipleSearchResult, SearchInitialState } from "@/types/searchTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState : SearchInitialState = {
    results: null,
    query: "",
    isLoading: false,
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
        },
        setQueryResults(state, action : PayloadAction<MultipleSearchResult>) {
            state.results = action.payload;
            state.isLoading = false;
        },
        setIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        }
    },
});

export const { setQuery, clearQuery, setQueryResults, setIsLoading } = searchSlice.actions;

export default searchSlice.reducer;