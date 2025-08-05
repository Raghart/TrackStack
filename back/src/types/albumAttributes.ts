import { SongsModel } from '../../models/songs/song.model';
import { Optional } from 'sequelize';

export interface AlbumAttributes {
  id: number;
  name: string;
  url_image: string;
  songs?: SongsModel[];
}

export interface AlbumWithSongs extends AlbumAttributes {
  songs: SongsModel[];
}

export type AlbumCreationAttributes = Optional<AlbumAttributes, 'id' | 'songs'>;
