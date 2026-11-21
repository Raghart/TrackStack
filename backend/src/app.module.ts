import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { SongsModule } from './songs/songs.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AlbumsModule } from './albums/albums.module';
import { GenresModule } from './genres/genres.module';
import { ArtistsModule } from './artists/artists.module';
import { SongDetailsModule } from './song_details/song_details.module';
import { SongArtistsModule } from './song_artists/song_artists.module';
import { SongGenresModule } from './song_genres/song_genres.module';
import { SearchModule } from './search/search.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { existsSync } from 'node:fs';
import { databaseSslOptions } from './utils/databaseSsl';
if (existsSync('.env')) process.loadEnvFile();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      uri: process.env.DB_URL,
      dialectOptions: databaseSslOptions
        ? { ssl: databaseSslOptions }
        : {},
      autoLoadModels: true,
      synchronize: false,
      logging: false,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      exclude: ['/graphql'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
        },
      },
    }),
    SongsModule,
    AlbumsModule,
    GenresModule,
    ArtistsModule,
    SongDetailsModule,
    SongArtistsModule,
    SongGenresModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
