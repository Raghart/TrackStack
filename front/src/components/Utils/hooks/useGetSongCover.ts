import { getSongData } from "@/queries/DetailQueries";
import { isNumber } from "@/types/verify";
import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const useGetSongCover = () => {
    const { songId } = useParams();
    const [getSongID, { data }] = useLazyQuery(getSongData);

    useEffect(() => {
        if (isNumber(songId)) {
            getSongID({ variables: { SongID: parseInt(songId) } }); 
        };
    }, [songId, getSongID]);

    return data?.getSongData;
};

export default useGetSongCover;