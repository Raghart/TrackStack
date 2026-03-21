import { SongResponse } from "@/types/songTypes";
import { useAppDispatch } from "../redux-hooks";
import { useLazyQuery } from "@apollo/client";
import { getPreviousSong } from "@/queries/MusicPlayerQueries";
import { useEffect } from "react";
import { setActiveAudio } from "@/reducers/songReducer";

const usePriorSong = (activeSong: SongResponse | null) => {
    const dispatch = useAppDispatch();
    const [getPriorSong, { data }] = useLazyQuery(getPreviousSong);
        
    useEffect(() => {
        if (data?.getPreviousSong) {
            dispatch(setActiveAudio(data.getPreviousSong));
        };
    }, [data, dispatch])

    const loadPrevSong = () => {
        if (!activeSong?.id) return;
        getPriorSong({ variables: { songID: activeSong.id } })
    };

    return loadPrevSong;
};

export default usePriorSong;