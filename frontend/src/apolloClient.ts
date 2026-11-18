import { ApolloClient, InMemoryCache, TypePolicies } from "@apollo/client";
import { AlbumResponse, ArtistResponse, SongResponse } from "@trackstack/schemas";
import { graphLink } from "./components/Utils/getGraphLink";

const typePolicies: TypePolicies = {
  Query: {
    fields: {
      getAllGenreSongs: {
        keyArgs: ["genre"],
        merge(existing, incoming, { args }) {
          const page: number = args?.page ?? 1;
          const limit: number = args?.limit ?? 20;
          const offset = (page - 1) * limit;
          const merged: SongResponse[] = [...(existing ?? [])];
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
          const merged: ArtistResponse[] = [...(existing ?? [])];
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
          const merged: AlbumResponse[] = [...(existing ?? [])];
          merged.splice(offset, incoming.length, ...incoming);
          return merged;
        }
      }
    }
  }
};

export const createCache = () => new InMemoryCache({ typePolicies });

export const client = new ApolloClient({
  cache: createCache(),
  link: graphLink,
});