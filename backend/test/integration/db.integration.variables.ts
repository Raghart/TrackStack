const DEFAULT_TEST_DB_URL =
  'postgres://trackstack_test:trackstack_test@localhost:5434/trackstack_test';

const ALLOWED_TEST_DB_NAMES = new Set(['trackstack_test']);

export function resolveTestDbUrl(): string {
  const url = process.env.TEST_DB_URL ?? DEFAULT_TEST_DB_URL;
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    throw new Error(
      `Invalid TEST_DB_URL: ${url}. Expected a postgres:// URL for the Docker test database.`,
    );
  }

  const hostname = parsed.hostname;
  const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(hostname);
  if (!isLocalHost) {
    throw new Error(
      `Refusing to run integration tests against non-local host "${hostname}". ` +
        'These tests are restricted to the Docker test database.',
    );
  }

  const dbName = parsed.pathname.replace(/^\//, '');
  if (!ALLOWED_TEST_DB_NAMES.has(dbName)) {
    throw new Error(
      `Refusing to run integration tests against database "${dbName}". ` +
        `Allowed test databases: ${[...ALLOWED_TEST_DB_NAMES].join(', ')}.`,
    );
  }

  return url;
};