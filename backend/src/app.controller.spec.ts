import { AppController } from './app.controller';

describe('AppController direct coverage', () => {
  it('should be defined', () => {
    const module = new AppController();
    expect(module).toBeInstanceOf(AppController);
  });
});
