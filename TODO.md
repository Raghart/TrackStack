# TODO-List
- Agregarle al AGENTS.md del backend que busque solo ejecutar tests unitarios de lo que haya corregido, ya que cuesta mucho ejecutarlos.
- Agregarle al AGENTS.md del backend que NUNCA coloque los tipos de una variable en el mismo archivo, los tipos se colocan dentro de ./src/types/*.ts
- Agregarle al AGENTS.md que no agregue types en archivos del Backend que no sean en la carpeta types, sin verificar antes que puede usar los tipos ya existentes en la carpetas de los tipos anteriormente mencionadas.

1. ~~Migrate from npm to pnpm (stricter dependency resolution, workspace support)~~.
2. Change the DB schema/migrations from Goose to Prisma.
3. Replace Elasticsearch search with PostgreSQL full-text search.
4. Adopt Zod for runtime validation at system boundaries (replacing manual checks).
5. Update AGENTS.md (root + backend) to reflect the new stack.
6. Make the project runnable via Docker (Dockerfile + docker-compose).