import { gql } from "@apollo/client";

export const multipleSearch = gql`
query multipleSearchByQuery ($query: String!) {
  multipleSearch(query: $query) {
    artistResults { id name album_cover type }
    albumResults { id name artists album_cover type }
    songResults { id name artists album album_cover url_preview type }
  }
}
`;