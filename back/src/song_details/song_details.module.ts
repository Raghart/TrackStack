import { Module } from '@nestjs/common';
import { SongDetailsService } from './song_details.service';
import { SongDetailsResolver } from './song_details.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { AlbumsModel } from '../../models/albums/albums.model';
import { SongDetailsModel } from '../../models/song_details/SongDetails.model';
import { SongsModel } from '../../models/songs/song.model';
import { ArtistsModel } from '../../models/artists/artists.model';
import { GenresModel } from '../../models/genres/genres.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SongDetailsModel,
      SongsModel,
      ArtistsModel,
      AlbumsModel,
      GenresModel,
    ]),
  ],
  providers: [SongDetailsService, SongDetailsResolver],
})
export class SongDetailsModule {}
