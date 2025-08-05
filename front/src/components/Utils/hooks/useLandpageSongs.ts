import { getLandpageSongs } from "@/queries/LandpageQueries";
import { SongResponse } from "@/types/songTypes";
import { useQuery } from "@apollo/client";

const useLandpageSongs = () => {
     const { loading, data } = useQuery(getLandpageSongs);
    const landpageSongs: SongResponse[] = data?.getLandpageSongs || [];

    return { landpageSongs, loading };
};

export default useLandpageSongs;