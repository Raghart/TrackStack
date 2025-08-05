import { Resolver } from '@nestjs/graphql';
import { SongDetailsService } from './song_details.service';

@Resolver()
export class SongDetailsResolver {
  constructor(private readonly SongDetailsService: SongDetailsService) {}
}
