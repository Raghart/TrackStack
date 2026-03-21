export interface SongResponse {
    id: number;
    name: string;
    artists: string[];
    album_cover: string;
    url_preview: string;
};

export interface FullSongResponse {
    id: number;
    name: string;
    artists: string[];
    genres: string[];
    album: string;
    album_cover: string;
    year: number;
    duration: number;
    spotify_id: string;
    url_preview: string;
};

export interface songStateType {
    activeSong: SongResponse | null;
    isPlaying: boolean;
};