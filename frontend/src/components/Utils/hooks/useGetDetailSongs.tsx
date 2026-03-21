import { getAllAlbumSongs, getAllArtistSongs } from "@/queries/DetailQueries";
import { SongResponse } from "@/types/songTypes";
import { ValidDetail } from "@/types/utilTypes";
import { useQuery } from "@apollo/client";

const useGetDetailSongs = (type: ValidDetail, filterValue: string) => {
    const query = type === "album" ? getAllAlbumSongs : getAllArtistSongs;
    const variables = type === "album" ? { album: filterValue } : { artist: filterValue };
    const { loading, data } = useQuery(query, { variables });
    const detailSongs: SongResponse[] = data?.getAllAlbumSongs ?? data?.getAllArtistSongs ?? [];
    return { data, loading, detailSongs }
};

export default useGetDetailSongs;