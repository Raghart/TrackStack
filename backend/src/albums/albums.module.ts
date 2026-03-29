import { Module } from '@nestjs/common';
import { AlbumsResolver } from './albums.resolver';
import { AlbumsService } from './albums.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AlbumsModel } from '../../models/albums/albums.model';
import { SongsModel } from '../../models/songs/song.model';
import { ArtistsModel } from '../../models/artists/artists.model';

@Module({
  imports: [
    SequelizeModule.forFeature([AlbumsModel, SongsModel, ArtistsModel]),
  ],
  providers: [AlbumsResolver, AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
