import { configureStore } from "@reduxjs/toolkit";
import songReducer from "./reducers/songReducer";
import recommendReducer from "./reducers/recommendReducer";
import searchReducer from "./reducers/searchReducer";

const store = configureStore({
    reducer: {
        songs: songReducer,
        songData: recommendReducer,
        search: searchReducer,
    },
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>

export default store;