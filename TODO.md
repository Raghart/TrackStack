# TODO-List
1. ~~Migrate from npm to pnpm (stricter dependency resolution, workspace support)~~.
2. ~~Add a tool for the agent to be able to query the database to extract any needed info~~.
3. ~~Migrate the tests from the uninstalled Jest to the Vitest test Framework~~.
4. ~~Tell the agent to add to the AGENTS.md about checking if the AGENTS.md content need an update if a change happened with the code structure~~.
5. ~~Refactor the README to make it have 3 READMEs. One for the root project to introduce the project, other for the backend and another for the frontend~~.
6. ~~Change the DB schema/migrations from Goose to Prisma~~.
7. ~~Revise the READMEs to make sure it doesn't repeat information and what could go inside the docs folder~~.
8. ~~Tell the agent that all the changes to the Database must be done through Prisma, never without a direct query~~.
9. ~~Replace Elasticsearch search with PostgreSQL full-text search~~.
10. Adopt Zod for runtime validation at system boundaries (replacing manual checks) (Backend Done).
11. Check the frontend README to see if it needs some improvements.
12. Add tests to the Frontend.
13. Make the agent fix the views in the cellphone because sometime it breaks.
14. Make the project runnable via Docker (Dockerfile + docker-compose).
15. Check if it's worthy to cifre the DB conexion to Aiven.
16. Would be a good idea to add a note to AGENTS.md to tell that don't change the code when making tests, it will be better to consult with me if it detects a possible security breach before deciding the way to patch it.
17. Update coverage image with one that covers both backend and frontend.
18. Upgrade the frontend/docs/architecture.md to be better. It feels kinda awkard right now.
19. There is a bug when typing a message in the search browser and open the console with F12, the text disappear.