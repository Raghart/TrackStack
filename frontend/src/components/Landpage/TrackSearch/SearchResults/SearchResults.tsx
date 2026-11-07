import SpotSearch from "./SpotSearch/SpotSearch";
import ArtistResults from "./ArtistResults/ArtistResults";
import AlbumResults from "./AlbumResults/AlbumResults";
import SongResults from "./SongResults/SongResults";
import { multipleSearchResults } from "@trackstack/schemas";

const SearchResults = ({ exactArtist, exactAlbum, exactSong, artistResults, albumResults, songResults  } : 
    multipleSearchResults) => {
    return(
        <>
            {exactSong && exactAlbum && exactArtist && (
                <SpotSearch song={exactSong} artist={exactArtist} album={exactAlbum} />
            )}
            {artistResults.length > 0 && (<ArtistResults artistResults={artistResults} />)}
            {albumResults.length > 0 && (<AlbumResults albumResults={albumResults} />)}
            {songResults.length > 0 && (<SongResults songResults={songResults} />)}
        </>
    );
};

export default SearchResults;