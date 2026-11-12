import { useAppDispatch } from "../redux-hooks";
import { useLazyQuery } from "@apollo/client";
import { getPreviousSong } from "@/queries/MusicPlayerQueries";
import { useEffect } from "react";
import { setActiveAudio } from "@/reducers/songReducer";
import { SongResponse, songResponseSchema } from "@trackstack/schemas";

const useLoadPriorSong = (activeSong: SongResponse | null) => {
    const dispatch = useAppDispatch();
    const [getPriorSong, { data }] = useLazyQuery(getPreviousSong);
        
    useEffect(() => {
        const result = songResponseSchema.safeParse(data?.getPreviousSong);
        if (result.success) {
            dispatch(setActiveAudio(result.data));
        };
    }, [data, dispatch])

    const loadPrevSong = () => {
        if (!activeSong?.id) return;
        getPriorSong({ variables: { songID: activeSong.id } });
    };

    return loadPrevSong;
};

export default useLoadPriorSong;