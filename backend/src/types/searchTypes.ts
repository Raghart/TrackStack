export interface songSearchResults {
  id: number;
  name: string;
  artists: string[];
  album: string;
  album_cover: string;
  url_preview: string;
  type: 'song';
}

export interface artistSearchResults {
  id: number;
  name: string;
  album_cover: string;
  type: 'artist';
}

export interface albumSearchResults {
  id: number;
  name: string;
  artists: string[];
  album_cover: string;
  type: 'album';
}

export interface artistHitStructure {
  hits: {
    hits: {
      _source: artistSearchResults;
    }[];
  };
}

export interface albumsHitStructure {
  hits: {
    hits: {
      _source: albumSearchResults;
    }[];
  };
}

export interface songsHitStructure {
  hits: {
    hits: {
      _source: songSearchResults;
    }[];
  };
}

export type searchResultType =
  | artistSearchResults
  | songSearchResults
  | albumSearchResults;

export interface multipleSearchResults {
  artistResults: artistSearchResults[];
  albumResults: albumSearchResults[];
  songResults: songSearchResults[];
  exactArtist: artistSearchResults;
  exactAlbum: albumSearchResults;
  exactSong: songSearchResults;
}
