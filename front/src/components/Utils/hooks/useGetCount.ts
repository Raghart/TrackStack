import { getDBLength } from "@/queries/LandpageQueries";
import { useQuery } from "@apollo/client";

const useGetCount = () => {;
    const { data } = useQuery(getDBLength);
    return data?.getDBLength;
};

export default useGetCount;