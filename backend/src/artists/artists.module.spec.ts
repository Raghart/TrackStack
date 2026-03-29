import { ArtistsModule } from './artists.module';

describe('ArtistsModule direct coverage', () => {
  it('should be defined', () => {
    const module = new ArtistsModule();
    expect(module).toBeInstanceOf(ArtistsModule);
  });
});
