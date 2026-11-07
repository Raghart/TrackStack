import { multipleSearchResults } from "@trackstack/schemas";

export interface SearchInitialState {
    results: multipleSearchResults | null;
    query: string;
    isLoading: boolean;
    isMobileSearch: boolean;
};

export interface searchResultsType {
    name: string;
    element: React.ReactElement;
};