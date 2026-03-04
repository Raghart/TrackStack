import { Box, SimpleGrid, Skeleton } from "@chakra-ui/react";
import { Zoom } from "react-awesome-reveal";
import PathHeader from "../Utils/PathHeader";
import { ARTIST_CARD_SIZES } from "../constants/ArtistPathC";

const AlbumSelection = () => {
    return(
        <Box w="full" h="full" direction="column" pt={8} gap={12} pb={20}>
            <Zoom triggerOnce direction="down" delay={100} style={{ paddingBottom: 40 }}>
                <PathHeader type="Albums" />
            </Zoom>
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} w="full" gap={4}>
                {Array.from({ length: 20 }).map((_, idx) => (
                    <Skeleton key={idx} w="full" maxW={ARTIST_CARD_SIZES} aspectRatio={3/4} 
                        borderRadius="2xl" inset={0} />
                    ))
                }
            </SimpleGrid>
        </Box>
    )
};

export default AlbumSelection;