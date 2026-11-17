import { getAllAlbumSongs, getAllArtistSongs } from "@/queries/DetailQueries";
import { ValidDetail } from "@/types/utilTypes";
import { useQuery } from "@apollo/client";
import { songResponseSchema } from "@trackstack/schemas";
import { stringSchema } from "@trackstack/schemas/zod.parsers";
import { useMemo } from "react";
import { parseArrayOrEmpty } from "../safeParse";

const useGetDetailSongs = (type: ValidDetail, filterValue: string) => {
    const parsedFilter = stringSchema.safeParse(filterValue);
    const skip = !["album", "artist"].includes(type) || !parsedFilter.success;
    const query = type === "album" ? getAllAlbumSongs : getAllArtistSongs;
    const variables = type === "album"
        ? { album: parsedFilter.success ? parsedFilter.data : filterValue }
        : { artist: parsedFilter.success ? parsedFilter.data : filterValue };
    const { loading, data } = useQuery(query, { variables, skip });

    const rawSongs = type === "album"
        ? data?.getAllAlbumSongs
        : data?.getAllArtistSongs;
    const detailSongs = useMemo(
        () => parseArrayOrEmpty(songResponseSchema, rawSongs),
        [rawSongs],
    );

    const hasData = detailSongs.length > 0;
    return { detailSongs, loading, hasData }
};

export default useGetDetailSongs;