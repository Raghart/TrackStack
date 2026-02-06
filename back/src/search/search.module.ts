import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchResolver } from './search.resolver';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ArtistsModule } from 'src/artists/artists.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { SongsModule } from 'src/songs/songs.module';
import { SongsModel } from '../../models/songs/song.model';
import { ArtistsModel } from '../../models/artists/artists.model';
import { AlbumsModel } from '../../models/albums/albums.model';
import { GenresModel } from '../../models/genres/genres.model';
import { Client } from "elasticsearch";
import dotenv from "dotenv"; dotenv.config();

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
  providers: [{
    provide: "BonsaiClient",
    useFactory: async () => {
        return new Client({
            host: process.env.ELASTICSEARCH_NODE,
            log: "error",
            ssl: { rejectUnauthorized: false }
        })
    }
}, SearchService, SearchResolver],
  exports: [SearchService],
})
export class SearchModule {}
