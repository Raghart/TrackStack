import { SongResponse } from "@/types/songTypes";
import handlePlayingSong from "./handlePlayingSong";
import { AppDispatch } from "@/store";

export const onPlayClick = (e: React.MouseEvent, song: SongResponse) => {
    return (dispatch: AppDispatch) => {
        e.stopPropagation();
        dispatch(handlePlayingSong(song));
    };
};