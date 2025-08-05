import { gql } from "@apollo/client";

export const multipleSearch = gql`
query multipleSearchByQuery ($query: String!) {
  multipleSearch(query: $query) {
    exactArtist { id name album_cover }
    exactAlbum { id name artists album_cover }
    exactSong { id name artists album album_cover url_preview }
    artistResults { id name album_cover }
    albumResults { id name artists album_cover }
    songResults { id name artists album album_cover url_preview }
  }
}
`;