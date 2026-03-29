import { Module } from '@nestjs/common';
import { SongArtistsResolver } from './song_artists.resolver';
import { SongArtistsService } from './song_artists.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AlbumsModel } from '../../models/albums/albums.model';
import { SongArtistsModel } from '../../models/song_artists/songArtists.model';
import { SongsModel } from '../../models/songs/song.model';
import { ArtistsModel } from '../../models/artists/artists.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SongArtistsModel,
      SongsModel,
      ArtistsModel,
      AlbumsModel,
    ]),
  ],
  providers: [SongArtistsResolver, SongArtistsService],
})
export class SongArtistsModule {}
