import { SongGenresModule } from './song_genres.module';

describe('SongGenresModule direct coverage', () => {
  it('should be defined', () => {
    const module = new SongGenresModule();
    expect(module).toBeInstanceOf(SongGenresModule);
  });
});
