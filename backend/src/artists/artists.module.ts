import { Module } from '@nestjs/common';
import { ArtistsResolver } from './artists.resolver';
import { ArtistsService } from './artists.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AlbumsModel } from '../../models/albums/albums.model';
import { ArtistsModel } from '../../models/artists/artists.model';
import { SongsModel } from '../../models/songs/song.model';
import { SongArtistsModel } from '../../models/song_artists/songArtists.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ArtistsModel,
      SongsModel,
      SongArtistsModel,
      AlbumsModel,
    ]),
  ],
  providers: [ArtistsResolver, ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
