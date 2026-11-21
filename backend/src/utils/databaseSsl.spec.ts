import { resolve } from 'node:path';
import { buildDatabaseSslOptions } from './databaseSsl';

describe('buildDatabaseSslOptions', () => {
  it('returns false when DB_SSL is not enabled', () => {
    expect(buildDatabaseSslOptions({})).toBe(false);
    expect(buildDatabaseSslOptions({ DB_SSL: 'false' })).toBe(false);
  });

  it('enables SSL without a custom CA when DB_SSL_CA is missing', () => {
    expect(buildDatabaseSslOptions({ DB_SSL: 'true' })).toEqual({
      require: true,
      rejectUnauthorized: true,
    });
  });

  it('loads the CA certificate from an absolute path', () => {
    const result = buildDatabaseSslOptions({
      DB_SSL: 'true',
      DB_SSL_CA: resolve('certs', 'ca.pem'),
    });

    expect(result).toMatchObject({
      require: true,
      rejectUnauthorized: true,
    });
    expect(result && result.ca).toContain('BEGIN CERTIFICATE');
  });

  it('resolves a relative CA path from the project root', () => {
    const result = buildDatabaseSslOptions({
      DB_SSL: 'true',
      DB_SSL_CA: 'certs/ca.pem',
    });

    expect(result && result.ca).toContain('BEGIN CERTIFICATE');
  });

  it('throws a clear error when the CA certificate does not exist', () => {
    expect(() =>
      buildDatabaseSslOptions({
        DB_SSL: 'true',
        DB_SSL_CA: 'certs/missing.pem',
      }),
    ).toThrow(/No se encontró el certificado CA/);
  });
});
