import { multipleSearchResults } from "@trackstack/schemas";

export type SearchStatus =
    | "idle"
    | "loading"
    | "success"
    | "empty"
    | "network-error"
    | "invalid-payload";

export type SearchFailureStatus = Extract<SearchStatus, "network-error" | "invalid-payload">;

export interface SearchInitialState {
    results: multipleSearchResults | null;
    query: string;
    isLoading: boolean;
    status: SearchStatus;
    isMobileSearch: boolean;
};

export interface searchResultsType {
    name: string;
    element: React.ReactElement;
};