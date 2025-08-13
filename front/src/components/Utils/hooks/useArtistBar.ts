import { getAllArtists } from "@/queries/DetailQueries";
import { ArtistResponse } from "@/types/artistTypes";
import { useQuery } from "@apollo/client";
import { useBreakpointValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const useArtistBar = () => {
    const [page, setPage] = useState<number>(1);
    const limit = useBreakpointValue({ base: 3, sm: 5, md: 7, lg: 10 });
    const [seed] = useState<string>(Math.random().toString().slice(2));
    const { data, refetch } = useQuery(getAllArtists, {
        skip: !limit,
        variables: { seed, page, limit },
    });
    const artists: ArtistResponse[] = data?.getAllArtists || [];

    useEffect(() => { 
        if (limit) refetch({ seed, page, limit }); 
    },[page, seed, limit, refetch]);

    return { artists, page, setPage, limit }
};

export default useArtistBar;