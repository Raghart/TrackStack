import { SongsModel } from '../../models/songs/song.model';
import { Optional } from 'sequelize';

export interface ArtistsAttributtes {
  id: number;
  name: string;
  songs?: SongsModel[];
}

export interface ArtistWithSongs extends ArtistsAttributtes {
  songs: SongsModel[];
}

export type ArtistsCreationAttributtes = Optional<
  ArtistsAttributtes,
  'id' | 'songs'
>;

export interface ArtistResponse {
  id: number;
  name: string;
  album_cover: string;
}
