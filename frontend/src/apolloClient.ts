import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { AlbumResponse, ArtistResponse, SongResponse } from "@trackstack/schemas";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI,
});

const wsLink = new GraphQLWsLink(createClient({
  url: import.meta.env.VITE_SUBSCRIPTION_URI,
}));

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error] ${operation.operationName}: ${message}`, { locations, path })
    );
  }
  if (networkError) {
    console.error(`[Network error] ${operation.operationName}: ${networkError.message}`, networkError);
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink,
  httpLink
)

export const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getAllGenreSongs: {
            keyArgs: ["genre"],
            merge(existing, incoming, { args }) {
              const page: number = args?.page ?? 1;
              const limit: number = args?.limit ?? 2;
              const offset = (page - 1) * limit;
              const merged: SongResponse[] = existing ? existing.slice(0) : [];
              merged.splice(offset, incoming.length, ...incoming);
              return merged;
            }
          },
          getAllArtists: {
            keyArgs: false,
            merge(existing, incoming, { args }) {
              const page: number = args?.page ?? 1;
              const limit: number = args?.limit ?? 20;
              const offset = (page - 1) * limit;
              const merged: ArtistResponse[] = existing ? existing.slice(0) : [];
              merged.splice(offset, incoming.length, ...incoming);
              return merged;
            }
          },
          getAlbums: {
            keyArgs: false,
            merge(existing, incoming, {args}) {
              const page: number = args?.page ?? 1;
              const limit: number = args?.limit ?? 20;
              const offset = (page - 1) * limit;
              const merged: AlbumResponse[] = existing ? existing.slice(0) : [];
              merged.splice(offset, incoming.length, ...incoming);
              return merged;
            }
          }
        }
      }
    }
  }),
  link: errorLink.concat(splitLink),
});