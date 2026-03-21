import { Flex, Link, useBreakpointValue } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import ArtistLinks from "@/components/Utils/ArtistLinks";

const LandSongCardInfo = ({ id, name, artists } : { id: number, name: string, artists: string[] }) => {
    const responsiveFontSize = useBreakpointValue({ base: "14px", sm: "15px", md: "15px", lg: "16px" });
    return(
        <Flex position="absolute" bottom="0" w="full" py={1} bg="blackAlpha.800" px={2} flexDirection="column" 
            textAlign="center" gap={0.5}>
            
            <Tooltip showArrow content={name} openDelay={500} closeDelay={0}
                contentProps={{ css: { "--tooltip-bg": "colors.blue.500", "color": "white", fontWeight: "bold" } }}>
                <Link href={`/songs/${id}`} _hover={{ textDecoration: "none", color: "blue.500"}}
                    fontWeight="600" color="white" lineHeight={1} pointerEvents="auto" textAlign="center"
                    transition="color 0.2s ease" _focus={{ outline: "none" }} lineClamp={1}
                    fontSize={{ base: "17px", sm: "19px", md: "20px", lg: "20px" }}
                    fontFamily="'Barlow Condensed', sans-serif">
                    {name}
                </Link>
            </Tooltip>

            <ArtistLinks artists={artists} color="yellow.500" hoverColor="yellow.600" size={responsiveFontSize} 
                font="'Barlow', sans-serif" fontWeight="600" lineClamp={1} />
        </Flex>
    );
};

export default LandSongCardInfo;