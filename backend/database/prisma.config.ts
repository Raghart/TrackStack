import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'prisma/config';

// Prisma 7 ya no carga .env automáticamente.
for (const envFile of [
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), 'backend/.env'),
]) {
  if (existsSync(envFile)) {
    process.loadEnvFile(envFile);
    break;
  }
}

// Reutiliza las mismas variables que el backend (Nest/Sequelize).
const datasourceUrl = process.env.DATABASE_URL ?? process.env.DB_URL;

if (!datasourceUrl) {
  throw new Error(
    'Falta DATABASE_URL o DB_URL. Añádela al .env de backend o expórtala en el entorno.',
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
