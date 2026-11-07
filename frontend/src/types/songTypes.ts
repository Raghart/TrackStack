import { SongResponse } from "@trackstack/schemas";

export interface songStateType {
    activeSong: SongResponse | null;
    isPlaying: boolean;
};