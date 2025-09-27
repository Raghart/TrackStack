import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync } from 'fs';
import { NextFunction, Request, Response } from 'express';
dotenv.config();

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const publicPath = join(__dirname, '..', '..', 'public');

  app.useStaticAssets(publicPath);

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.removeHeader('Permissions-Policy');
    next();
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    const isGetRequest = req.method === 'GET';
    const isAPIRoute =
      req.path.startsWith('/api') || req.path.startsWith('/graphql');
    const isStaticfile = existsSync(join(publicPath, req.path));

    if (isGetRequest && !isAPIRoute && !isStaticfile) {
      res.sendFile(join(publicPath, 'index.html'));
    } else {
      next();
    }
  });

  app.enableCors({
    origin: process.env.URL_DOMAIN,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(process.env.LOCAL_GRAPHQL);
}
void bootstrap();
