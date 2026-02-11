import { AlbumsModel } from '../../models/albums/albums.model';
import { ArtistsModel } from '../../models/artists/artists.model';
import { GenresModel } from '../../models/genres/genres.model';
import { SongDetailsModel } from '../../models/song_details/SongDetails.model';
import { Optional } from 'sequelize';

export interface SongAttributes {
  id: number;
  name: string;
  spotify_id: string;
  url_preview: string;
  duration: number;
  year: number;
  album_id: number;
  artists?: ArtistsModel[];
  album?: AlbumsModel;
  genres?: GenresModel[];
  songDetails?: SongDetailsModel;
}

export interface SongResponseAttributes extends SongAttributes {
  artists: ArtistsModel[];
  album: AlbumsModel;
}

export interface SongResponse {
  id: number;
  name: string;
  artists: string[];
  album_cover: string;
  url_preview: string;
}

export interface SongCosResponse {
  id: number;
  name: string;
  artists: string;
  album_cover: string;
  url_preview: string;
  cos_sim: number;
}

export interface FullSongResponse {
  id: number;
  name: string;
  artists: string[];
  genres: string[];
  album: string;
  album_cover: string;
  duration: number;
  year: number;
  spotify_id: string;
  url_preview: string;
}

export interface FullSongResponseAttributes extends SongAttributes {
  artists: ArtistsModel[];
  album: AlbumsModel;
  genres: GenresModel[];
}

export interface IASongResponse extends SongAttributes {
  artists: ArtistsModel[];
  album: AlbumsModel;
  genres: GenresModel[];
  songDetails: SongDetailsModel;
}

export type SongCreationAttributes = Optional<
  SongAttributes,
  'id' | 'artists' | 'album' | 'genres' | 'songDetails'
>;
