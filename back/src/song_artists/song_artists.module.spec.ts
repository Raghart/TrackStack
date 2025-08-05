import { SongArtistsModule } from './song_artists.module';

describe('SongArtistsModule direct coverage', () => {
  it('should be defined', () => {
    const module = new SongArtistsModule();
    expect(module).toBeInstanceOf(SongArtistsModule);
  });
});
