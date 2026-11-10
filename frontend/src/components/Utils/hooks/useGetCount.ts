import { getDBLength } from "@/queries/LandpageQueries";
import { useQuery } from "@apollo/client";
import { floatNumberSchema } from "@trackstack/schemas";

const useGetCount = () => {;
    const { data } = useQuery(getDBLength);
    return data?.getDBLength ? floatNumberSchema.parse(data?.getDBLength) : undefined;
};

export default useGetCount;