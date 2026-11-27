import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { existsSync } from 'node:fs';
if (existsSync('.env')) process.loadEnvFile();

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet({ contentSecurityPolicy: false }));

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`Page on: http://localhost:${port}`);
  if (process.env?.NODE_ENV !== "production") {
    console.log(`GraphQL on: http://localhost:${port}/graphql`);
  };
}
void bootstrap();
