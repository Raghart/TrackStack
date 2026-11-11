import { getSongData } from "@/queries/DetailQueries";
import { useLazyQuery } from "@apollo/client";
import { floatNumberSchema, fullSongResponseSchema } from "@trackstack/schemas";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { parseDataOrUndefined } from "../safeParse";

const useGetSongCover = () => {
    const { songId } = useParams();
    const [getSongID, { data }] = useLazyQuery(getSongData);

    useEffect(() => {
        const result = floatNumberSchema.safeParse(songId);
        if (result.success) {
            getSongID({ variables: { SongID: result.data } });
        };
    }, [songId, getSongID]);
    return parseDataOrUndefined(fullSongResponseSchema, data?.getSongData);
};

export default useGetSongCover;