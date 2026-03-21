process.loadEnvFile();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.URL_DOMAIN,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Page on: ${process.env.LOCAL_PAGE_URL}`);
  console.log(`GraphQL on: ${process.env.LOCAL_GRAPHQL}`);
}
void bootstrap();
