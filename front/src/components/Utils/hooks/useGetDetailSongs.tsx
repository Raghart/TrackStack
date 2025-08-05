import { getAllAlbumSongs, getAllArtistSongs } from "@/queries/DetailQueries";
import { SongResponse } from "@/types/songTypes";
import { ValidDetail } from "@/types/utilTypes";
import { useQuery } from "@apollo/client";
import { useState } from "react";

const useGetDetailSongs = (type: ValidDetail, filterValue: string) => {
    const [visibleCount, setVisibleCount] = useState<number>(20);
    const query = type === "album" ? getAllAlbumSongs : getAllArtistSongs;
    const variables = type === "album" ? { album: filterValue } : { artist: filterValue };
    const { loading, data } = useQuery(query, { variables });
    const detailSongs: SongResponse[] = data?.getAllAlbumSongs ?? data?.getAllArtistSongs ?? [];
    const visibleSongs = detailSongs.slice(0, visibleCount);
    
    const onLoadMore = () => {
        if (visibleSongs.length < detailSongs.length) { setVisibleCount(prev => prev + 20); } 
    };

    return { data, loading, visibleSongs, onLoadMore }
};

export default useGetDetailSongs;