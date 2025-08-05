import { normalizeText } from 'src/types/normalizeText';
import { searchResultType } from 'src/types/searchTypes';

export const sortResults = <seachType extends searchResultType>(
  query: string,
  results: seachType[],
): seachType[] => {
  return [...results].sort((a, b) => {
    const aName = normalizeText(a.name);
    const bName = normalizeText(b.name);

    const aMatch = aName === query;
    const bMatch = bName === query;
    const aIncludes = aName.includes(query);
    const bIncludes = bName.includes(query);

    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    if (aIncludes && !bIncludes) return -1;
    if (!aIncludes && bIncludes) return 1;
    return 0;
  });
};
