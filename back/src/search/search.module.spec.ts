import { SearchModule } from './search.module';

describe('SearchModule direct coverage', () => {
  it('should be defined', () => {
    const module = new SearchModule();
    expect(module).toBeInstanceOf(SearchModule);
  });
});
