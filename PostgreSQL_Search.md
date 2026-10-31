Sí, es viable, y para tu caso concreto (≈50k canciones) PostgreSQL es más que suficiente. No necesitas Elasticsearch para esto. La combinación que recomiendo es:
- pg_trgm: da tolerancia a typos y búsqueda por subcadena. Sustituye al fuzzy + n-grams de Elasticsearch.
- unaccent: para que mago de oz encuentre Mägo de Oz.
- ILIKE + ranking con CASE y similarity(): sustituye los boosts tipo name^3, name.edge^2, name.ngram.
Equivalencias:
Elasticsearch	PostgreSQL
fuzziness: AUTO	similarity() + operador % con índice GIN
n-grams / edge-ngrams	trigramas de pg_trgm y LIKE 'term%'
name^3	prioridad en CASE: exacto > prefijo > contiene > fuzzy
índice de Elasticsearch	índice GIN sobre lower(unaccent(name))
El estado actual: SearchService devuelve arrays vacíos y todos sus specs están en describe.skip. O sea, ahora mismo la búsqueda no funciona; no es que haya que “migrar” una implementación activa, hay que construirla.

Mi recomendación: pg_trgm + unaccent, campos exact* nullable, y mantener el alcance de búsqueda actual (solo nombres) en una primera iteración. Con eso el resultado será muy parecido a lo que tenías en Elasticsearch, sin infraestructura extra.