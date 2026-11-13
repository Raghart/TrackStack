import SpotSearch from "./SpotSearch/SpotSearch";
import ArtistResults from "./ArtistResults/ArtistResults";
import AlbumResults from "./AlbumResults/AlbumResults";
import SongResults from "./SongResults/SongResults";
import { multipleSearchResults } from "@trackstack/schemas";

const SearchResults = ({ artistResults, albumResults, songResults  } : 
    multipleSearchResults) => {
    return(
        <>
            {songResults[0] && albumResults[0] && artistResults[0] && (
                <SpotSearch song={songResults[0]} artist={artistResults[0]} album={albumResults[0]} />
            )}
            {artistResults.length > 0 && (<ArtistResults artistResults={artistResults.slice(1)} />)}
            {albumResults.length > 0 && (<AlbumResults albumResults={albumResults.slice(1)} />)}
            {songResults.length > 0 && (<SongResults songResults={songResults.slice(1)} />)}
        </>
    );
};

export default SearchResults;