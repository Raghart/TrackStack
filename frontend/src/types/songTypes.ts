export interface SongResponse {
    id: number;
    name: string;
    artists: string[];
    album_cover: string;
    url_preview: string;
};

export interface songStateType {
    activeSong: SongResponse | null;
    isPlaying: boolean;
};