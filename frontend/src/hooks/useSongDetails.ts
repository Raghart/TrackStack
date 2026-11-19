import { useEffect, useMemo } from "react";
import { useAppDispatch } from "../redux-hooks";
import { useQuery } from "@apollo/client";
import { loadAudio } from "@/reducers/songReducer";
import { getSongData } from "@/queries/DetailQueries";
import { fullSongResponseSchema } from "@trackstack/schemas";
import { positiveIntSchema } from "@trackstack/schemas/zod.parsers";
import { parseDataOrUndefined } from "../safeParse";

const useSongDetails = (songId: number) => {
    const dispatch = useAppDispatch();
    const parsedSongId = positiveIntSchema.safeParse(songId);
    const validSongId = parsedSongId.success ? parsedSongId.data : undefined;

    const { loading, data } = useQuery(getSongData, {
        variables: { SongID: validSongId },
        skip: validSongId === undefined,
    });

    const songData = useMemo(
        () => validSongId === undefined
            ? undefined
            : parseDataOrUndefined(fullSongResponseSchema, data?.getSongData),
        [data, validSongId]
    );

    useEffect(() => {
        if (songData) {
            dispatch(loadAudio(songData));
        }
    }, [songData, dispatch]);

    return { songData, loading: validSongId === undefined ? false : loading }
};

export default useSongDetails;