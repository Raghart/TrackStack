import { getSongData } from "@/queries/DetailQueries";
import { useLazyQuery } from "@apollo/client";
import { floatNumberSchema } from "@trackstack/schemas";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const useGetSongCover = () => {
    const { songId } = useParams();
    const [getSongID, { data }] = useLazyQuery(getSongData);

    useEffect(() => {
        if (floatNumberSchema.safeParse(songId).success) {
            getSongID({ variables: { SongID: floatNumberSchema.parse(songId) } }); 
        };
    }, [songId, getSongID]);

    return data?.getSongData;
};

export default useGetSongCover;