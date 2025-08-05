import { Box, LinkOverlay } from "@chakra-ui/react";
import { ARTCARD_FONTSIZES } from "../constants/ArtistPathC";

const ArtistCardLayer = ({ name } : { name: string }) => {
    return(
        <Box className="overlay" position="absolute" inset={0} w="full" h="full" p={1} display="flex" 
            alignItems="center" justifyContent="center" opacity={0} borderRadius="2xl" backdropFilter="blur(6px)"
            transition="opacity 0.3s ease" bg="rgba(0, 0, 0, 0.4)">

            <LinkOverlay href={`/artists/${encodeURIComponent(name)}`} textAlign="center" lineClamp={3}
                fontSize={ARTCARD_FONTSIZES} color="yellow.500" fontWeight="800" fontStyle="italic" lineHeight={1} 
                overflow={name.length < 20 ? "visible" : "hidden"} fontFamily="'Barlow', sans-serif">
                {name}
            </LinkOverlay>
        </Box>
    );
};

export default ArtistCardLayer;