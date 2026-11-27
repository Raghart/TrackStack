import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchResolver } from './search.resolver';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ArtistsModule } from '@/artists/artists.module';
import { AlbumsModule } from '@/albums/albums.module';
import { SongsModule } from '@/songs/songs.module';
import { SongsModel } from '../../models/songs/song.model';
import { ArtistsModel } from '../../models/artists/artists.model';
import { AlbumsModel } from '../../models/albums/albums.model';
import { GenresModel } from '../../models/genres/genres.model';
import { existsSync } from 'node:fs';
if (existsSync('.env')) process.loadEnvFile();

@Module({
  imports: [
    ConfigModule,
    ArtistsModule,
    AlbumsModule,
    SongsModule,
    SequelizeModule.forFeature([
      SongsModel,
      ArtistsModel,
      AlbumsModel,
      GenresModel,
    ]),
  ],
  providers: [
    SearchService,
    SearchResolver,
  ],
  exports: [SearchService],
})
export class SearchModule {}
