import { Card, Heading, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { ART_TITLE_FONTSIZES, SPOT_CARD_SIZES, SPOTARTIST_FONTSIZES } from "@/components/constants/TrackSearchC";
import ArtistImage from "./ArtistImage";
import { ArtistResponse } from "@/types/artistTypes";

const SpotArtist = ({ name, album_cover }:  ArtistResponse ) => {
    return(
        <LinkBox position="relative" as={Card.Root} flexDirection="row" overflow="hidden" mt={3} bg="transparent" 
            border="transparent" _hover={{ bg: "blue.800", "& .artist-zoom": { transform: "scale(1.1)" } }} 
            transition="background 0.3s ease, transform 0.3s ease" p={2} w="full" maxW={SPOT_CARD_SIZES}
            data-testid="spotArtistCard">
            
            <ArtistImage name={name} album_cover={album_cover} />

            <Card.Body gap={{ base: 1, sm: 2, md: 2, lg: 2 }} justifyContent="center" alignItems="center" 
                className="artist-zoom" transition="transform 0.3s ease" p={3}>
                
                <LinkOverlay href={`/artists/${encodeURIComponent(name)}`} lineHeight={1} fontWeight="600"
                    fontSize={SPOTARTIST_FONTSIZES} textAlign="center" fontFamily="'Barlow Condensed', sans-serif"
                    lineClamp={3} color="white">
                    {name}
                </LinkOverlay>

                <Heading fontSize={ART_TITLE_FONTSIZES} letterSpacing="wide" color="yellow.500" lineHeight={1} 
                    textAlign="center" fontFamily="'Barlow Condensed', sans-serif" fontWeight="700">
                    Artist
                </Heading>

            </Card.Body>
        </LinkBox>
    );
};

export default SpotArtist;