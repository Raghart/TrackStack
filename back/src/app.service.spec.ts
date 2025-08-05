import { AppService } from './app.service';

describe('AppService direct coverage', () => {
  it('should be defined', () => {
    const module = new AppService();
    expect(module).toBeInstanceOf(AppService);
  });
});
