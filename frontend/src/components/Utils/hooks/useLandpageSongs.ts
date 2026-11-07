import { getLandpageSongs } from "@/queries/LandpageQueries";
import { useQuery } from "@apollo/client";
import { SongResponse } from "@trackstack/schemas";

const useLandpageSongs = () => {
    const { loading, data } = useQuery(getLandpageSongs);
    const landpageSongs: SongResponse[] = data?.getLandpageSongs || [];

    return { landpageSongs, loading };
};

export default useLandpageSongs;