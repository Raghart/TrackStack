import { getAllAlbumSongs, getAllArtistSongs } from "@/queries/DetailQueries";
import { ValidDetail } from "@/types/utilTypes";
import { useQuery } from "@apollo/client";
import { songResponseSchema } from "@trackstack/schemas";

const useGetDetailSongs = (type: ValidDetail, filterValue: string) => {
    const query = type === "album" ? getAllAlbumSongs : getAllArtistSongs;
    const variables = type === "album" ? { album: filterValue } : { artist: filterValue };
    const { loading, data } = useQuery(query, { variables });
    const detailSongs = songResponseSchema.array().parse(
        data?.getAllAlbumSongs ?? data?.getAllArtistSongs ?? []
    );
    return { data, loading, detailSongs }
};

export default useGetDetailSongs;