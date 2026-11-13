import { Box, For } from "@chakra-ui/react";
import SpotSong from "./SpotSong/SpotSong";
import SpotArtist from "./SpotArtist/SpotArtist";
import SpotAlbum from "./SpotAlbum/SpotAlbum";
import useSortResults from "@/components/Utils/hooks/useSortResults";
import { searchResultsType } from "@/types/searchTypes";
import { normalizeText } from "@/components/Utils/normalizeText";
import { Zoom } from "react-awesome-reveal";
import { AlbumResponse, ArtistResponse, SongResponse } from "@trackstack/schemas";

const SpotSearch = ({ song, artist, album } : { 
    song?: SongResponse, artist?: ArtistResponse, album?: AlbumResponse }) => {
    const spotResults: searchResultsType[] = [
        ...(song ? [{ name: normalizeText(song.name), element: <SpotSong {...song} /> }] : []),
        ...(artist ? [{ name: normalizeText(artist.name), element: <SpotArtist {...artist} /> }] : []),
        ...(album ? [{ name: normalizeText(album.name), element: <SpotAlbum {...album} /> }] : []),
    ];
    const sortedResults = useSortResults(spotResults);

    return(
        <For each={sortedResults}>
            {((comp,idx) => (
                <Zoom triggerOnce direction="right" key={`${idx}-${comp.name}`}>
                    <Box>{comp.element}</Box>
                </Zoom>
            ))}
        </For>
    );
};

export default SpotSearch;