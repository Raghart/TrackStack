import { AlbumsModule } from './albums.module';

describe('AlbumsModule direct coverage', () => {
  it('should be defined', () => {
    const module = new AlbumsModule();
    expect(module).toBeInstanceOf(AlbumsModule);
  });
});
