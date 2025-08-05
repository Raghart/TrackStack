import { GenresModule } from './genres.module';

describe('GenresModule direct coverage', () => {
  it('should be defined', () => {
    const module = new GenresModule();
    expect(module).toBeInstanceOf(GenresModule);
  });
});
