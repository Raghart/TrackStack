import { Module } from '@nestjs/common';
import { GenresResolver } from './genres.resolver';
import { GenresService } from './genres.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GenresModel } from '../../models/genres/genres.model';
import { SongsModel } from '../../models/songs/song.model';
import { SongGenresModel } from '../../models/song_genres/SongGenres.model';

@Module({
  imports: [
    SequelizeModule.forFeature([GenresModel, SongsModel, SongGenresModel]),
  ],
  providers: [GenresResolver, GenresService],
})
export class GenresModule {}
