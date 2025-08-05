import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecommendData } from "@/types/RecDataTypes";
import { SongResponse } from "@/types/songTypes";

const initialState: RecommendData = {
    genres: [],
    energy: 0.5,
    speechLevel: 0.165,
    danceability: 0.5,
    duration: 2.5,
    sentiment: 0.5,
    voiceType: 0.05,
    mood: 1,
    acousticness: 0.15,
    results: [],
};

const recommendSlice = createSlice({
    name: "recommend",
    initialState,
    reducers: {
        setRecommendedGenres(state, action: PayloadAction<string[]>) {
            state.genres = action.payload
        },
        deleteLastGenre(state) {
            state.genres = state.genres.slice(0, -1);
        },
        setEnergy(state, action: PayloadAction<number>) {
            state.energy = action.payload;
        },
        setSpeechLevel(state, action: PayloadAction<number>) {
            state.speechLevel = action.payload;
        },
        setDanceability(state, action: PayloadAction<number>) {
            state.danceability = action.payload;
        },
        setDuration(state, action: PayloadAction<number>) {
            state.duration = action.payload;
        },
        setSentiment(state, action: PayloadAction<number>) {
            state.sentiment = action.payload;
        },
        setVoiceType(state, action: PayloadAction<number>) {
            state.voiceType = action.payload;
        },
        setMood(state, action: PayloadAction<number>) {
            state.mood = action.payload;
        },
        setAcousticness(state, action: PayloadAction<number>) {
            state.acousticness = action.payload;
        },
        setLaraRecommendations(state, action: PayloadAction<SongResponse[]>) {
            state.results = action.payload;
        },
    }
});

export const { setRecommendedGenres, setEnergy, setSpeechLevel, setDuration, setSentiment, setVoiceType, setMood,
    setDanceability, setAcousticness, setLaraRecommendations, deleteLastGenre } = recommendSlice.actions;

export default recommendSlice.reducer;