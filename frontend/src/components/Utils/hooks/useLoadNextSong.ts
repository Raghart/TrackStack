import { useLazyQuery } from "@apollo/client";
import { useAppDispatch } from "../redux-hooks";
import { setActiveAudio } from "@/reducers/songReducer";
import { getNextSong } from "@/queries/MusicPlayerQueries";
import { useEffect } from "react";
import { SongResponse } from "@trackstack/schemas";

const useLoadNextSong = (activeSong: SongResponse | null) => {
    const dispatch = useAppDispatch();
        
    const [getFollowingSong, { data }] = useLazyQuery(getNextSong);

    useEffect(() => {
        if (data?.getNextSong) {
            dispatch(setActiveAudio(data.getNextSong));
        };
    }, [data, dispatch])

    const loadNextSong = () => {
        if (!activeSong?.id) return;
        getFollowingSong({ variables: { songID: activeSong.id } });
    };

    return loadNextSong
};

export default useLoadNextSong;