import { useLazyQuery } from "@apollo/client";
import { useAppDispatch } from "../redux-hooks";
import { setActiveAudio } from "@/reducers/songReducer";
import { getNextSong } from "@/queries/MusicPlayerQueries";
import { useEffect } from "react";
import { SongResponse, songResponseSchema } from "@trackstack/schemas";
import { parseDataOrUndefined } from "../safeParse";

const useLoadNextSong = (activeSong: SongResponse | null) => {
    const dispatch = useAppDispatch();
        
    const [getFollowingSong, { data }] = useLazyQuery(getNextSong);

    useEffect(() => {
        const parsedData = parseDataOrUndefined(songResponseSchema, data?.getNextSong);
        if (parsedData) {
            dispatch(setActiveAudio(parsedData));
        };
    }, [data, dispatch])

    const loadNextSong = () => {
        if (!activeSong?.id) return;
        getFollowingSong({ variables: { songID: activeSong.id } });
    };

    return loadNextSong
};

export default useLoadNextSong;