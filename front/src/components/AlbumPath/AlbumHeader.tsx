import { Heading, Highlight } from "@chakra-ui/react";
import { ARTPATH_HEADER, ARTPATH_HIGHLIGHT } from "../constants/ArtistPathC";

const AlbumHeader = () => {
    return(
        <Heading fontSize={ARTPATH_HEADER} userSelect="none" lineHeight={1} letterSpacing="wider" 
            fontFamily="'Barlow Condensed', sans-serif" fontWeight="600" textAlign="center">
            <Highlight query="Album" styles={{ fontSize: ARTPATH_HIGHLIGHT, fontStyle: "normal", 
                bgGradient: "to-br", bgClip: "text", gradientFrom: "yellow.500", 
                gradientVia: "orange.500", gradientTo: "yellow.500", fontWeight: "800", 
                letterSpacing: "wider" }}>
                Select an Album
            </Highlight>
        </Heading>
    );
};

export default AlbumHeader;