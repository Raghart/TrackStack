import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import SongNameBox from "./SongNameBox";
import YearBox from "./YearBox";
import DurationBox from "./DurationBox";
import SpotifyUrl from "./SpotifyUrl";
import ArtistLinks from "../../Utils/ArtistLinks";
import { Slide, Zoom, Bounce, Fade } from "react-awesome-reveal";
import { SONGBOX_SHADOW, SONGBOX_SIZES } from "../../constants/SongDetailsC";
import { FullSongResponse } from "@/types/songTypes";

const SongInfoLayout = ({ name, artists, year, duration, spotify_id }: FullSongResponse ) => {
    const responsiveSize = useBreakpointValue({ base: "15px", sm: "24px", md: "25px", lg: "3xl" });
    return(
        <Flex align="center" transition="scale 0.3s ease" direction="column"  border="5px solid" justify="center" 
            borderColor="blue.700" borderRadius="3xl" backdropFilter="blur(10px)" p={4} gap={4} h="full"
            _hover={{ boxShadow: SONGBOX_SHADOW, scale: "1.03"}} w="full" maxW={SONGBOX_SIZES}>
            
            <Box textAlign="center">
                <Zoom triggerOnce direction="down" delay={100}>
                    <SongNameBox name={name} />
                    <ArtistLinks artists={artists} color="yellow.500" hoverColor="yellow.400" size={responsiveSize} 
                        font="'Barlow', sans-serif" fontWeight="700" lineClamp={2} />
                </Zoom>
            </Box>

            <Fade triggerOnce direction="down" delay={100}>
                <YearBox year={year} />
            </Fade>

            <Slide triggerOnce direction="up" delay={100}>
                <DurationBox duration={duration} />
            </Slide>

            <Bounce triggerOnce direction="left" delay={100}>
                <SpotifyUrl url={`https://open.spotify.com/track/${spotify_id}`} />
            </Bounce>
        </Flex>
    );
};

export default SongInfoLayout;