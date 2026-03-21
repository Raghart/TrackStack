import { ArtistsModel } from '../../models/artists/artists.model';
import { SongsModel } from '../../models/songs/song.model';
import { Optional } from 'sequelize';

export interface SongArtistsAttributes {
  id: number;
  song_id: number;
  artist_id: number;
  song?: SongsModel;
  artist?: ArtistsModel;
}

export interface SongArtistsRP extends SongArtistsAttributes {
  song: SongsModel;
  artist: ArtistsModel;
}

export type SongArtistsCreationAttributes = Optional<
  SongArtistsAttributes,
  'id' | 'song' | 'artist'
>;
