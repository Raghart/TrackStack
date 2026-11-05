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

export interface multipleSearchResults {
  artistResults: artistSearchResults[];
  albumResults: albumSearchResults[];
  songResults: songSearchResults[];
  exactArtist: artistSearchResults;
  exactAlbum: albumSearchResults;
  exactSong: songSearchResults;
}
