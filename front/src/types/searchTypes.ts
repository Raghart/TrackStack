import { AlbumResponse } from "./albumTypes";
import { ArtistResponse } from "./artistTypes";
import { SongResponse } from "./songTypes";

export interface SearchInitialState {
    results: MultipleSearchResult | null;
    query: string;
    isLoading: boolean;
    isMobileSearch: boolean;
};

export interface MultipleSearchResult {
    exactArtist: ArtistResponse;
    exactAlbum: AlbumResponse;
    exactSong: SongResponse;
    artistResults: ArtistResponse[];
    albumResults: AlbumResponse[];
    songResults: SongResponse[];
};

export interface searchResultsType {
    name: string;
    element: React.ReactElement;
};