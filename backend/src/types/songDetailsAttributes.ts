import { SongsModel } from '../../models/songs/song.model';
import { Optional } from 'sequelize';

export interface SongDetailsAttributes {
  id: number;
  song_id: number;
  song?: SongsModel;
  danceability: number;
  energy: number;
  track_key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  time_signature: number;
}

export type SongDetailsCreationAttributes = Optional<
  SongDetailsAttributes,
  'id' | 'song'
>;
