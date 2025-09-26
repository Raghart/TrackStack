import { Module } from '@nestjs/common';
import { SongGenresResolver } from './song_genres.resolver';
import { SongGenresService } from './song_genres.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AlbumsModel } from '../../models/albums/albums.model';
import { SongGenresModel } from '../../models/song_genres/SongGenres.model';
import { SongsModel } from '../../models/songs/song.model';
import { ArtistsModel } from '../../models/artists/artists.model';
import { GenresModel } from '../../models/genres/genres.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SongGenresModel,
      SongsModel,
      ArtistsModel,
      AlbumsModel,
      GenresModel,
    ]),
  ],
  providers: [SongGenresResolver, SongGenresService],
})
export class SongGenresModule {}
