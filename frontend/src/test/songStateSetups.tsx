import { renderHook } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import type { ReactNode } from "react";
import { vi } from "vitest";
import type { SongResponse } from "@trackstack/schemas";
import songReducer from "@/reducers/songReducer";
import useSongState from "@/components/Utils/hooks/useSongState";
import type { songStateType } from "@/types/songTypes";

export const activeSongFixture: SongResponse = {
    id: 42,
    name: "Nude",
    artists: ["Radiohead"],
    album_cover: "https://example.com/in-rainbows.jpg",
    url_preview: "https://example.com/nude.mp3",
};

export const nextSongFixture: SongResponse = {
    id: 43,
    name: "Weird Fishes / Arpeggi",
    artists: ["Radiohead"],
    album_cover: "https://example.com/in-rainbows.jpg",
    url_preview: "https://example.com/weird-fishes.mp3",
};

export const defaultSongState: songStateType = {
    activeSong: null,
    isPlaying: false,
};

export const createSongStore = (songState: songStateType = defaultSongState) =>
    configureStore({
        reducer: { songs: songReducer },
        preloadedState: { songs: { songState } },
    });

export type SongStateStore = ReturnType<typeof createSongStore>;

export const createAudioMock = () => {
    const audio = document.createElement("audio");
    const playMock = vi.spyOn(audio, "play").mockResolvedValue(undefined);
    const pauseMock = vi.spyOn(audio, "pause").mockImplementation(() => undefined);

    return { audio, playMock, pauseMock };
};

export const renderSongState = (store: SongStateStore, audio: HTMLAudioElement) => {
    const audioRef = { current: audio };

    return renderHook(() => useSongState(audioRef), {
        wrapper: ({ children }: { children: ReactNode }) => (
            <Provider store={store}>{children}</Provider>
        ),
    });
};

export const dispatchCanPlay = (audio: HTMLAudioElement) => {
    audio.dispatchEvent(new Event("canplay"));
};
