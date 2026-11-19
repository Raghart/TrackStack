import { useAppSelector } from "../redux-hooks";

const useActSongState = (id: number) => {
    const activeSongState = useAppSelector(state => state.songs.songState);
    const isCurrentSong: boolean = id === activeSongState.activeSong?.id;
    const isSongPlaying: boolean = isCurrentSong && activeSongState.isPlaying;

    return isSongPlaying;
};

export default useActSongState;