import { Module } from '@nestjs/common';
import { SongsResolver } from './songs.resolver';
import { SongsService } from './songs.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AlbumsModel } from '../../models/albums/albums.model';
import { SongsModel } from '../../models/songs/song.model';
import { ArtistsModel } from '../../models/artists/artists.model';
import { GenresModel } from '../../models/genres/genres.model';
import { SongDetailsModel } from '../../models/song_details/SongDetails.model';
import { SongArtistsModel } from '../../models/song_artists/songArtists.model';
import { SongGenresModel } from '../../models/song_genres/SongGenres.model';
import { PubSub } from 'graphql-subscriptions';
import { GoogleGenAI } from '@google/genai';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SongsModel,
      AlbumsModel,
      ArtistsModel,
      GenresModel,
      SongDetailsModel,
      SongArtistsModel,
      SongGenresModel,
    ]),
  ],
  providers: [SongsResolver, SongsService, {
    provide: 'PUB_SUB',
    useValue: new PubSub(),
  }, {
    provide: 'AI',
    useValue: new GoogleGenAI({
      apiKey: process.env.API_KEY,
    }),
  }],
  exports: [SongsService],
})
export class SongsModule {}
