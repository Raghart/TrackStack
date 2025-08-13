import { Box, For, Link, SimpleGrid } from "@chakra-ui/react";
import ArtistSearchCard from "./ArtistSearchCard";
import { Zoom, Bounce } from "react-awesome-reveal";
import { ArtistResponse } from "@/types/artistTypes";

const ArtistResults = ({ artistResults }: { artistResults: ArtistResponse[] }) => {
    return(
        <Box mt={4} zIndex={1}>
            <Zoom triggerOnce direction="left">
                <Link href={`/artists`} textDecorationColor="yellow.500" fontSize="4xl" letterSpacing="wide" 
                    fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" color="yellow.500">
                    Artists
                </Link>
            </Zoom>

            <Bounce triggerOnce direction="right">
                <SimpleGrid columns={{ base: 2, sm: 3, md: 3, lg: 5 }} mt={2} gap={2}>
                    <For each={artistResults}>
                        {(artist: ArtistResponse) => <ArtistSearchCard key={artist.id} {...artist} />}
                    </For>
                </SimpleGrid>
            </Bounce>
        </Box>
    );
};

export default ArtistResults;