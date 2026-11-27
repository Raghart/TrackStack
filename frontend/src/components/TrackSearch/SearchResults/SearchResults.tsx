import SpotSearch from "./SpotSearch/SpotSearch";
import ArtistResults from "./ArtistResults/ArtistResults";
import AlbumResults from "./AlbumResults/AlbumResults";
import SongResults from "./SongResults/SongResults";
import { multipleSearchResults } from "@trackstack/schemas";

const SearchResults = ({ artistResults, albumResults, songResults  } : 
    multipleSearchResults) => {
    const hasSpotResults = songResults.length > 0 || albumResults.length > 0 || artistResults.length > 0;
    return(
        <>
            {hasSpotResults && (
                <SpotSearch song={songResults[0]} artist={artistResults[0]} album={albumResults[0]} />
            )}
            {artistResults.length > 1 && (<ArtistResults artistResults={artistResults.slice(1)} />)}
            {albumResults.length > 1 && (<AlbumResults albumResults={albumResults.slice(1)} />)}
            {songResults.length > 1 && (<SongResults songResults={songResults.slice(1)} />)}
        </>
    );
};

export default SearchResults;