import { getDBLength } from "@/queries/LandpageQueries";
import { useQuery } from "@apollo/client";
import { parseDataOrUndefined } from "../safeParse";
import { floatNumberSchema } from "../../../../../schemas/zod.parsers";

const useGetCount = () => {;
    const { data } = useQuery(getDBLength);
    return parseDataOrUndefined(floatNumberSchema, data?.getDBLength);
};

export default useGetCount;