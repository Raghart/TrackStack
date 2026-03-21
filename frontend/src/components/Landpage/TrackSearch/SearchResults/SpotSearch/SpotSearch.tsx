import { Box, For } from "@chakra-ui/react";
import SpotSong from "./SpotSong/SpotSong";
import SpotArtist from "./SpotArtist/SpotArtist";
import SpotAlbum from "./SpotAlbum/SpotAlbum";
import useSortResults from "@/components/Utils/hooks/useSortResults";
import { SongResponse } from "@/types/songTypes";
import { ArtistResponse } from "@/types/artistTypes";
import { AlbumResponse } from "@/types/albumTypes";
import { searchResultsType } from "@/types/searchTypes";
import { normalizeText } from "@/components/Utils/normalizeText";
import { Zoom } from "react-awesome-reveal";

const SpotSearch = ({ song, artist, album } : { song: SongResponse, artist: ArtistResponse, album: AlbumResponse }) => {
    const sortedResults: searchResultsType[] = useSortResults([
        { name: normalizeText(song.name), element: <SpotSong {...song} /> },
        { name: normalizeText(artist.name), element: <SpotArtist {...artist} /> },
        { name: normalizeText(album.name), element: <SpotAlbum {...album} /> },
    ]);

    return(
        <For each={sortedResults}>
            {((comp,idx) => (
                <Zoom triggerOnce direction="right" key={`${idx}-${song.id}-${artist.id}-${album.id}`}>
                    <Box>{comp.element}</Box>
                </Zoom>
            ))}
        </For>
    );
};

export default SpotSearch;