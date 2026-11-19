import { getLandpageSongs } from "@/queries/LandpageQueries";
import { useQuery } from "@apollo/client";
import { songResponseSchema } from "@trackstack/schemas";
import { parseArrayOrEmpty } from "../safeParse";

const useLandpageSongs = () => {
    const { loading, data } = useQuery(getLandpageSongs);
    const landpageSongs = parseArrayOrEmpty(songResponseSchema, data?.getLandpageSongs);
    const hasData = landpageSongs.length > 0;
    return { landpageSongs, loading, hasData };
};

export default useLandpageSongs;