import { getDBLength } from "@/queries/LandpageQueries";
import { parseDataOrUndefined } from "@/Utils/safeParse";
import { useQuery } from "@apollo/client";
import { floatNumberSchema } from "@trackstack/schemas/zod.parsers";

const useGetCount = () => {;
    const { data } = useQuery(getDBLength);
    return parseDataOrUndefined(floatNumberSchema, data?.getDBLength);
};

export default useGetCount;