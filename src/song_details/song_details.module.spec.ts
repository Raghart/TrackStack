import { SongDetailsModule } from './song_details.module';

describe('SongDetailsModule direct coverage', () => {
  it('should be defined', () => {
    const module = new SongDetailsModule();
    expect(module).toBeInstanceOf(SongDetailsModule);
  });
});
