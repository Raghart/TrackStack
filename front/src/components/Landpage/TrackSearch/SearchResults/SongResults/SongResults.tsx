import { Box, For, Heading, SimpleGrid } from "@chakra-ui/react";
import { useAppSelector } from "@/components/Utils/redux-hooks";
import { Zoom, Bounce } from "react-awesome-reveal";
import SongSearchCard from "./SongSearchCard";
import { SongResponse } from "@/types/songTypes";

const SongResults = ({ songResults } : { songResults: SongResponse[] }) => {
    const { isPlaying, activeSong } = useAppSelector(state  => state.songs.songState);
    return(
        <Box mt={5} zIndex={1}>
            <Zoom triggerOnce direction="left">
                <Heading fontSize="4xl" userSelect="none" color="blue.500" letterSpacing="wide" fontWeight="600"
                    fontFamily="'Barlow Condensed', sans-serif">
                    Songs
                </Heading>
            </Zoom>

            <Bounce triggerOnce direction="right">
                <SimpleGrid mt={5} columns={{ base: 1, sm: 2, md: 2, lg: 3  }} gap={1}>
                    <For each={songResults}>
                        {(song: SongResponse) => <SongSearchCard key={song.id} song={song} 
                            isSongPlaying={isPlaying && song.id === activeSong?.id} /> }
                    </For>
                </SimpleGrid>
            </Bounce>
        </Box>
    );
};

export default SongResults;