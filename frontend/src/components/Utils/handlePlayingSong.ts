import { AppDispatch, RootState } from "@/store";
import { setActiveAudio, togglePlayAudio } from "@/reducers/songReducer";
import { SongResponse } from "@/types/songTypes";

const handlePlayingSong = (song: SongResponse) => (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const currentSong = state.songs.songState.activeSong;
  if (song.id === currentSong?.id) {
    dispatch(togglePlayAudio());
  } else {
    dispatch(setActiveAudio(song));
  }
};

export default handlePlayingSong;