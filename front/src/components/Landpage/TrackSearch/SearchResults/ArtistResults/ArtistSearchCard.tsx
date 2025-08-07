import { Card, Heading, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { ART_RESULTS_ART_FONTSIZE, ART_RESULTS_FONTSIZE, SEARCH_RESULTS_SIZES } from 
    "@/components/constants/TrackSearchC";
import ArtistSearchImg from "./ArtistSearchImg";
import { ArtistResponse } from "@/types/artistTypes";

const ArtistSearchCard = ({ name, album_cover } : ArtistResponse ) => {
    return(
        <LinkBox as={Card.Root} position="relative" bg="transparent" border="transparent" _hover={{ bg: "blue.800" }} 
            maxW={SEARCH_RESULTS_SIZES} transition="background-color 0.3s ease, transform 0.3s ease" p={2} w="full">
            
            <ArtistSearchImg album_cover={album_cover} />

            <Card.Body alignItems="center" justifyContent="center" textAlign="center" p={1} gap={1}>
                <Card.Title fontSize={ART_RESULTS_FONTSIZE} lineClamp={2} lineHeight={1} fontWeight="600" 
                    fontFamily="'Barlow Condensed', sans-serif" color="white">
                    <LinkOverlay href={`/artists/${encodeURIComponent(name)}`}>
                        {name}
                    </LinkOverlay>
                </Card.Title>

                <Heading color="yellow.500" lineHeight={1} fontFamily="'Barlow Condensed', sans-serif" 
                    fontWeight="600" fontSize={ART_RESULTS_ART_FONTSIZE} letterSpacing="wide">
                    Artist
                </Heading>
                
            </Card.Body>
        </LinkBox>
    );
};

export default ArtistSearchCard;