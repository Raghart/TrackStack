import { AppModule } from './app.module';

describe('AppModule direct coverage', () => {
  it('should be defined', () => {
    const module = new AppModule();
    expect(module).toBeInstanceOf(AppModule);
  });
});
