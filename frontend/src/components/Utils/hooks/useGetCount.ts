import { getDBLength } from "@/queries/LandpageQueries";
import { useQuery } from "@apollo/client";
import { floatNumberSchema } from "@trackstack/schemas";
import { parseDataOrUndefined } from "../safeParse";

const useGetCount = () => {;
    const { data } = useQuery(getDBLength);
    return parseDataOrUndefined(floatNumberSchema, data?.getDBLength);
};

export default useGetCount;