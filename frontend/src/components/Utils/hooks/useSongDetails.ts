import { useEffect, useMemo } from "react";
import { useAppDispatch } from "../redux-hooks";
import { useQuery } from "@apollo/client";
import { loadAudio } from "@/reducers/songReducer";
import { getSongData } from "@/queries/DetailQueries";
import { fullSongResponseSchema } from "@trackstack/schemas";
import { parseDataOrEmpty } from "../safeParse";

const useSongDetails = (songId: string | undefined) => {
    const dispatch = useAppDispatch();
    const { loading, data } = useQuery(getSongData, { variables: { SongID: Number(songId) } });

    const songData = useMemo(
        () => parseDataOrEmpty(fullSongResponseSchema, data?.getSongData),
        [data]
    );

    useEffect(() => {
        if (songData) {
            dispatch(loadAudio(songData));
        }
    }, [songData, dispatch]);

    return { songData, loading }
};

export default useSongDetails;