import ArtistLinks from "@/components/Utils/ArtistLinks";
import { Card, Heading, LinkBox, LinkOverlay, useBreakpointValue } from "@chakra-ui/react";
import { ALBUM_TITLE_FONTSIZES, SPOT_CARD_SIZES, SPOTALBUM_FONTSIZES } from "@/components/constants/TrackSearchC";
import SpotAlbumImg from "./SpotAlbumImg";
import { AlbumResponse } from "@/types/albumTypes";

const SpotAlbum = ({ name, artists, album_cover }: AlbumResponse) => {
    const responsiveSize = useBreakpointValue({ base: "15px", sm: "20px", md: "24px", lg: "24px" });
    return(
        <LinkBox as={Card.Root} position="relative" flexDirection="row" overflow="hidden" bg="transparent" p={2}
            border="transparent" _hover={{ bg: "blue.800", "& .hover-card": { transform: "scale(1.1)" } }} mt={2}
            transition="background-color 0.3s ease" maxW={SPOT_CARD_SIZES} maxH="220px" h="full" w="full"
            data-testid="spotAlbumCard">

            <SpotAlbumImg name={name} album_cover={album_cover} />

            <Card.Body flexDir="column" alignItems="center" justifyContent="center" gap={1} p={3} textAlign="center" 
                className="hover-card" transition="transform 0.3s ease, background 0.3s ease">
            
                <LinkOverlay href={`/albums/${encodeURIComponent(name)}`} textAlign="center" lineHeight={1}
                    fontSize={SPOTALBUM_FONTSIZES} lineClamp={2} fontFamily="'Barlow Condensed', sans-serif"
                    fontWeight="600" color="white">
                    {name}
                </LinkOverlay>
                
                <ArtistLinks artists={artists} color="yellow.500" hoverColor="yellow.600" fontWeight="600" 
                    font="'Barlow', sans-serif" size={responsiveSize} />

                <Heading color="orange.500" lineHeight={1} fontFamily="'Barlow Condensed', sans-serif" 
                    fontWeight="700" fontSize={ALBUM_TITLE_FONTSIZES} letterSpacing="wide">
                    Album
                </Heading>

            </Card.Body>
        </LinkBox>
    );
};


export default SpotAlbum;
