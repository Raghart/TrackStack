import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { SongResponse } from "./types/songTypes";
import { ArtistResponse } from "./types/artistTypes";
import { AlbumResponse } from "./types/albumTypes";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI,
});

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
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URI,
  })
});