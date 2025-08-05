import { SongsModule } from './songs.module';

describe('SongsModule direct coverage', () => {
  it('should be defined', () => {
    const module = new SongsModule();
    expect(module).toBeInstanceOf(SongsModule);
  });
});
