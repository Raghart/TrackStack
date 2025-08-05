import { Resolver } from '@nestjs/graphql';
import { SongArtistsService } from './song_artists.service';

@Resolver()
export class SongArtistsResolver {
  constructor(private readonly SongArtistsService: SongArtistsService) {}
}
