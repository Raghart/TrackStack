import { GenresModel } from '../../models/genres/genres.model';
import { SongsModel } from '../../models/songs/song.model';
import { Optional } from 'sequelize';

export interface SongGenresAttributes {
  id: number;
  song_id: number;
  genre_id: number;
  song?: SongsModel;
  genre?: GenresModel;
}

export interface SongGenresRPWithSongs extends SongGenresAttributes {
  song: SongsModel;
  genre: GenresModel;
}

export type SongGenresCreationAttributes = Optional<
  SongGenresAttributes,
  'id' | 'song' | 'genre'
>;
