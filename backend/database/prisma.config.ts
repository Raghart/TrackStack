import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'prisma/config';

for (const envFile of [
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), 'backend/.env'),
]) {
  // Las rutas son literales resueltas arriba, no provienen de entrada externa.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (existsSync(envFile)) {
    process.loadEnvFile(envFile);
    break;
  }
}

const datasourceUrl = process.env.DB_URL;

if (!datasourceUrl) {
  throw new Error(
    'Falta DB_URL. Añádela al .env de backend o expórtala en el entorno.',
  );
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: datasourceUrl,
  },
});
