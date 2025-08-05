import ArtistLinks from "@/components/Utils/ArtistLinks";
import { Card, LinkBox, LinkOverlay, useBreakpointValue } from "@chakra-ui/react";
import BtnPlaySearchSong from "./BtnPlaySearchSong";
import { SONGSEARCH_FONTSIZES, SONGSEARCH_SIZES } from "@/components/constants/TrackSearchC";
import { SongResponse } from "@/types/songTypes";

const SongSearchCard = ({ song, isSongPlaying } : { song: SongResponse, isSongPlaying: boolean }) => {
    const responsiveSize = useBreakpointValue({ base: "15px", sm: "16px", md: "19px", lg: "19px" });
    return(
        <LinkBox as={Card.Root} flexDirection="row" overflow="hidden" bg="transparent" border="transparent" p={3} 
            _hover={{ bg: "blue.800", "& .hover-image": { opacity: 1 } }} transition="background-color 0.3s ease"  
            w="full" maxW={SONGSEARCH_SIZES}>
            
            <BtnPlaySearchSong song={song} isSongPlaying={isSongPlaying} />

            <Card.Body justifyContent="center" alignContent="center" textAlign="center" p={0} pl={1} gap={1}>
                <LinkOverlay href={`/songs/${song.id}`} lineHeight={1} lineClamp={2} fontWeight="600"
                    fontFamily="'Barlow Condensed', sans-serif" fontSize={SONGSEARCH_FONTSIZES}>
                    {song.name}
                </LinkOverlay>

                <ArtistLinks artists={song.artists} color="yellow.500" size={responsiveSize} fontWeight="600" 
                    font="'Barlow', sans-serif" hoverColor="yellow.600" />
            </Card.Body>
        </LinkBox>
    );
};

export default SongSearchCard;