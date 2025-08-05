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
import dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_TYPE,
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: 6543,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      autoLoadModels: true,
      synchronize: true,
      logging: false,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
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
