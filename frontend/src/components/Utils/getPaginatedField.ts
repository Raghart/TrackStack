import { FieldPolicy } from "@apollo/client";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

type PaginatedArgs = {
  page?: number;
  limit?: number;
};

const mergePaginatedPage = <T>(
  existing: readonly T[] | undefined,
  incoming: readonly T[],
  { args }: { args: PaginatedArgs | null }
): T[] => {
  const page = args?.page ?? DEFAULT_PAGE;
  const limit = args?.limit ?? DEFAULT_LIMIT;
  const offset = (page - 1) * limit;
  const merged = [...(existing ?? [])];
  merged.splice(offset, incoming.length, ...incoming);
  return merged;
};

export const getPaginatedField = <T>(keyArgs: FieldPolicy<T[]>["keyArgs"]): FieldPolicy<T[]> => ({
  keyArgs,
  merge: mergePaginatedPage
});