import { SearchFailureStatus } from "@/types/searchTypes";

export interface SearchErrorMessage {
    title: string;
    description: string;
};

export const getSearchErrorMessage = (status: SearchFailureStatus): SearchErrorMessage => {
    switch (status) {
        case "network-error":
            return {
                title: "Search unavailable",
                description: "We couldn't connect to the search service. Check your connection and try again.",
            };
        case "invalid-payload":
            return {
                title: "Search results unavailable",
                description: "We received an unexpected response. Please try again.",
            };
    }
};
