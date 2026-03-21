import { useLazyQuery } from "@apollo/client";
import { useAppDispatch } from "../redux-hooks";
import { setActiveAudio } from "@/reducers/songReducer";
import { SongResponse } from "@/types/songTypes";
import { getNextSong } from "@/queries/MusicPlayerQueries";
import { useEffect } from "react";

const useLoadBtnLogic = (activeSong: SongResponse | null) => {
    const dispatch = useAppDispatch();
        
    const [getFollowingSong, { data }] = useLazyQuery(getNextSong, {
        onCompleted: (data) => {
            if (data.getNextSong) {
                dispatch(setActiveAudio(data.getNextSong));
            };
        }
    });

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

export default useLoadBtnLogic;