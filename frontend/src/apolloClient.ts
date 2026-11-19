import { ApolloClient, InMemoryCache, TypePolicies } from "@apollo/client";
import { AlbumResponse, ArtistResponse, SongResponse } from "@trackstack/schemas";
import { graphLink } from "./Utils/getGraphLink";
import { getPaginatedField } from "./Utils/getPaginatedField";

const typePolicies: TypePolicies = {
  Query: {
    fields: {
      getAllGenreSongs: getPaginatedField<SongResponse>(["genre"]),
      getAllArtists: getPaginatedField<ArtistResponse>(false),
      getAlbums: getPaginatedField<AlbumResponse>(false)
    }
  }
};

export const createCache = () => new InMemoryCache({ typePolicies });

export const client = new ApolloClient({
  cache: createCache(),
  link: graphLink,
});