import { Flex, Link, useBreakpointValue } from "@chakra-ui/react";
import ArtistLinks from "../Utils/ArtistLinks";
import { Tooltip } from "@/components/ui/tooltip";
import { SONGCARD_ART_FONTSIZES, SONGCARD_FONTSIZES } from "../constants/SongCardC";

const SongCardInfo = ({ id, name, artists } : { id: number, name: string, artists: string[] }) => {
    const artistFontsizes = useBreakpointValue(SONGCARD_ART_FONTSIZES);
    return(
        <Flex position="absolute" bottom="0" w="full" px={1} bg="blackAlpha.800" flexDirection="column" 
            gap={0.5} textAlign="center" py={{ base: 1, sm: 2 }}>
                
            <Tooltip showArrow content={name} openDelay={500} closeDelay={100}
                contentProps={{ css: { "--tooltip-bg": "colors.blue.500", "color": "white", fontWeight: "bold" } }}>
                <Link href={`/songs/${id}`} _hover={{ textDecoration: "none", color: "blue.500"}} fontWeight="600" 
                    color="white" lineHeight={1} pointerEvents="auto" textAlign="center" transition="color 0.2s ease"
                    _focus={{ outline: "none" }} lineClamp={1} fontSize={SONGCARD_FONTSIZES} 
                    fontFamily="'Barlow Condensed', sans-serif" data-testid="songName">
                    {name}
                </Link>
            </Tooltip>

            <ArtistLinks artists={artists} color="yellow.500" hoverColor="yellow.600" size={artistFontsizes}
                lineClamp={1} font="'Barlow', sans-serif" fontWeight="700" />
        </Flex>
    );
};

export default SongCardInfo;