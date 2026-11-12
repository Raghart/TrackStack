import { useLazyQuery } from "@apollo/client";
import { useAppDispatch } from "../redux-hooks";
import { setActiveAudio } from "@/reducers/songReducer";
import { getNextSong } from "@/queries/MusicPlayerQueries";
import { useEffect } from "react";
import { SongResponse, songResponseSchema } from "@trackstack/schemas";

const useLoadNextSong = (activeSong: SongResponse | null) => {
    const dispatch = useAppDispatch();
        
    const [getFollowingSong, { data }] = useLazyQuery(getNextSong);

    useEffect(() => {
        const result = songResponseSchema.safeParse(data?.getNextSong);
        if (result.success) {
            dispatch(setActiveAudio(result.data));
        };
    }, [data, dispatch])

    const loadNextSong = () => {
        if (!activeSong?.id) return;
        getFollowingSong({ variables: { songID: activeSong.id } });
    };

    return loadNextSong
};

export default useLoadNextSong;