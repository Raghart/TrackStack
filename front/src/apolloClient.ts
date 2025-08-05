import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getAllGenreSongs: {
            keyArgs: ["genre"],
            merge(existing, incoming, { args }) {
              const page = args?.page ?? 1;
              const limit = args?.limit ?? 2;
              const offset = (page - 1) * limit;
              const merged = existing ? existing.slice(0) : [];
              
              for (let i = 0; i < incoming.length; i++) {
                merged[offset + i] = incoming[i];
              };
              return merged;
            }
          },
          getAllArtists: {
            keyArgs: false,
            merge(existing, incoming, { args }) {
              const page = args?.page ?? 1;
              const limit = args?.limit ?? 20;
              const offset = (page - 1) * limit;
              const merged = existing ? existing.slice(0) : [];
              for (let i = 0; i < incoming.length; i++) {
                merged[offset + i] = incoming[i]
              }
              return merged;
            }
        }
        }
      }
    }
  }),
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URI,
  })
});