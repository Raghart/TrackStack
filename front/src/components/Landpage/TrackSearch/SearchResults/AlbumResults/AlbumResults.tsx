import { Box, For, Heading, SimpleGrid } from "@chakra-ui/react";
import AlbumSearchCard from "./AlbumSearchCard";
import { Zoom, Bounce } from "react-awesome-reveal";
import { AlbumResponse } from "@/types/albumTypes";

const AlbumResults = ({ albumResults } : { albumResults: AlbumResponse[] }) => {
    return(
        <Box mt={7} zIndex={1}>
            <Zoom triggerOnce direction="left">
                <Heading fontSize="4xl" color="orange.400" fontFamily="'Barlow Condensed', sans-serif" 
                    userSelect="none" fontWeight="600">
                    Albums
                </Heading>
            </Zoom>

            <Bounce triggerOnce direction="right">
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} mt={4} gap={2}>
                    <For each={albumResults}>
                        {(album: AlbumResponse) => <AlbumSearchCard key={album.id} {...album} /> }
                    </For>
                </SimpleGrid>
            </Bounce>
        </Box>
    );
};

export default AlbumResults;