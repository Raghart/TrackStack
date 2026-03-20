import { useLazyQuery } from "@apollo/client";
import { useAppDispatch } from "../redux-hooks";
import { setActiveAudio } from "@/reducers/songReducer";
import { SongResponse } from "@/types/songTypes";
import { getNextSong, getPreviousSong } from "@/queries/MusicPlayerQueries";
import { useEffect } from "react";

const useLoadBtnLogic = (activeSong: SongResponse | null) => {
    const dispatch = useAppDispatch();
    const [getPriorSong, { data }] = useLazyQuery(getPreviousSong);
    
        useEffect(() => {
            if (data?.getPreviousSong) {
                dispatch(setActiveAudio(data.getPreviousSong));
            };
        }, [data, dispatch])
        
    const [getFollowingSong] = useLazyQuery(getNextSong, {
        onCompleted: (data) => {
            if (data.getNextSong) {
                dispatch(setActiveAudio(data.getNextSong));
            };
        }
    });

    const loadNextSong = () => {
        if (!activeSong?.id) return;
        getFollowingSong({ variables: { songID: activeSong.id } });
    };

    const loadPrevSong = () => {
        if (!activeSong?.id) return;
        getPriorSong({ variables: { songID: activeSong.id } });
    };

    return { loadPrevSong, loadNextSong }
};

export default useLoadBtnLogic;