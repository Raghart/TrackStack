import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';

const TRUE_VALUES = new Set(['true', '1', 'yes', 'on']);

function resolveCertificatePath(certificatePath: string): string {
  if (isAbsolute(certificatePath)) {
    if (existsSync(certificatePath)) return certificatePath;

    throw new Error(
      `No se encontró el certificado CA de la base de datos en "${certificatePath}". Revisa DB_SSL_CA.`,
    );
  }

  const projectRoots = new Set([
    process.cwd(),
    resolve(__dirname, '..'),
    resolve(__dirname, '..', '..'),
    resolve(__dirname, '..', '..', '..'),
  ]);
  const candidates = [...projectRoots].map((root) =>
    resolve(root, certificatePath),
  );
  const found = candidates.find((candidate) => existsSync(candidate));

  if (!found) {
    throw new Error(
      `No se encontró el certificado CA de la base de datos en "${certificatePath}". Rutas comprobadas: ${candidates.join(', ')}. Revisa DB_SSL_CA.`,
    );
  }

  return found;
}

export function buildDatabaseSslOptions(
  env: NodeJS.ProcessEnv = process.env,
):
  | false
  | { require: true; rejectUnauthorized: boolean; ca?: string } {
  const sslEnabled = TRUE_VALUES.has((env.DB_SSL ?? '').trim().toLowerCase());

  if (!sslEnabled) return false;

  const certificatePath = env.DB_SSL_CA?.trim();

  if (!certificatePath) {
    return { require: true, rejectUnauthorized: true };
  }

  return {
    require: true,
    rejectUnauthorized: true,
    ca: readFileSync(resolveCertificatePath(certificatePath), 'utf8'),
  };
}

export const databaseSslOptions = buildDatabaseSslOptions();
