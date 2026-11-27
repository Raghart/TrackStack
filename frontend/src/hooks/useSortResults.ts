import { searchResultsType } from "@/types/searchTypes";
import { normalizeText } from "@/Utils/normalizeText";
import { useAppSelector } from "@/Utils/redux-hooks";

const useSortResults = (results: searchResultsType[]) => {
    const query = normalizeText(useAppSelector(state => state.search.query));
    return [...results].sort((a, b) => {

        const aMatch = a.name === query;
        const bMatch = b.name === query;
        const aIncludes = a.name.includes(query);
        const bIncludes = b.name.includes(query);

        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        if (aIncludes && !bIncludes) return -1;
        if (!aIncludes && bIncludes) return 1; 
        return 0;
    });
};

export default useSortResults;