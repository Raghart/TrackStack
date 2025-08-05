import { Heading, Highlight } from "@chakra-ui/react";
import { ARTPATH_HEADER, ARTPATH_HIGHLIGHT } from "../constants/ArtistPathC";

const ArtistHeader = () => {
    return(
        <Heading fontSize={ARTPATH_HEADER} userSelect="none" lineHeight={1} letterSpacing="wider" 
            fontFamily="'Barlow Condensed', sans-serif" fontWeight="600" textAlign="center">
            <Highlight query="Artist" styles={{ fontSize: ARTPATH_HIGHLIGHT, fontStyle: "normal", bgGradient: "to-br", 
                bgClip: "text", gradientFrom: "orange.500", gradientVia: "yellow.500", gradientTo: "orange.500", 
                fontWeight: "800", letterSpacing: "wider" }}>
                Select an Artist
            </Highlight>
        </Heading>
    );
};

export default ArtistHeader;