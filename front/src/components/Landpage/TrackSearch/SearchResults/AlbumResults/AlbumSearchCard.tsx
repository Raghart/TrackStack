import ArtistLinks from "@/components/Utils/ArtistLinks";
import { Card, LinkBox, LinkOverlay, useBreakpointValue } from "@chakra-ui/react";
import { ALB_RESULTS_FONTSIZES, SEARCH_RESULTS_SIZES } from "@/components/constants/TrackSearchC";
import AlbumSearchImg from "./AlbumSearchImg";
import { AlbumResponse } from "@/types/albumTypes";

const AlbumSearchCard = ({ name, album_cover, artists } : AlbumResponse) => {
    const fontSize = useBreakpointValue({ base: "14px", sm: "17px", md: "17px", lg: "19px", });
    return(
        <LinkBox as={Card.Root} pos="relative" bg="transparent" border="transparent" p={3} w="full" 
            transition="background-color 0.3s ease, transform 0.3s ease" _hover={{ bg: "blue.800" }} 
            maxW={SEARCH_RESULTS_SIZES}>

            <AlbumSearchImg album_cover={album_cover} />
            
            <Card.Body p={1} textAlign="center" alignItems="center" justifyContent="center" gap={1}>
                <Card.Title fontSize={ALB_RESULTS_FONTSIZES} fontFamily="'Barlow Condensed', sans-serif" 
                    lineHeight={1} lineClamp={2}>
                    <LinkOverlay href={`/albums/${encodeURIComponent(name)}`}>
                        {name}
                    </LinkOverlay>
                </Card.Title>

                <ArtistLinks artists={artists} color="yellow.500" hoverColor="yellow.600" fontWeight="600"
                    font="'Barlow', sans-serif" size={fontSize} />
            </Card.Body>
        </LinkBox>
    );
};

export default AlbumSearchCard;