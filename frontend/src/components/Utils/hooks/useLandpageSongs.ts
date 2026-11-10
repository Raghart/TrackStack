import { getLandpageSongs } from "@/queries/LandpageQueries";
import { useQuery } from "@apollo/client";
import { songResponseSchema } from "@trackstack/schemas";

const useLandpageSongs = () => {
    const { loading, data } = useQuery(getLandpageSongs);
    const landpageSongs = data?.getLandpageSongs ? 
        songResponseSchema.array().parse(data.getLandpageSongs) : undefined;

    return { landpageSongs, loading };
};

export default useLandpageSongs;