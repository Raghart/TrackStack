import { SongResponse, songStateType } from "@/types/songTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { songState : songStateType } = {
    songState: {
        activeSong: null,
        isPlaying: false
    },
};

const songSlice = createSlice({
    name: "songs",
    initialState,
    reducers: {
        setActiveAudio(state, action: PayloadAction<SongResponse>) {
            state.songState.activeSong = action.payload;
            state.songState.isPlaying = true;
        },
        loadAudio(state, action: PayloadAction<SongResponse>) {
            state.songState.activeSong = action.payload;
        },
        togglePlayAudio(state) {
            if (state.songState.activeSong?.id) {
                state.songState.isPlaying = !state.songState.isPlaying;
            };
        },
    },
});

export const { setActiveAudio, togglePlayAudio, loadAudio } = songSlice.actions;

export default songSlice.reducer;