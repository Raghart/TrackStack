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
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { existsSync } from 'node:fs';
import type { IncomingMessage } from 'node:http';
import { databaseSslOptions } from './utils/databaseSsl';
import { GqlThrottlerGuard } from '@/utils/gqlThrottlerGuard';

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
    ThrottlerModule.forRoot([
      {
        name: 'ai',
        ttl: 60_000,
        limit: 5,
        blockDuration: 60_000,
      },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: process.env?.NODE_ENV !== "production" ? true : false,
      context: (ctx: {
        req?: IncomingMessage;
        res?: unknown;
        extra?: { request: IncomingMessage };
      }) => ({
        req: ctx.req ?? ctx.extra?.request,
        res: ctx.res,
      }),
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
  providers: [AppService, GqlThrottlerGuard],
})
export class AppModule {}