import { Heading, Highlight } from "@chakra-ui/react";

const ArtistBarHeader = () => {
    return(
        <Heading fontFamily="'Barlow', sans-serif" fontWeight="600" letterSpacing="wide" userSelect="none" 
            pl={2}>
            <Highlight query="Artist" styles={{ bgGradient: "to-br", bgClip: "text", gradientFrom: "orange.500", 
                gradientVia: "yellow.500", gradientTo: "orange.500", fontSize: "2xl", fontStyle: "italic", 
                fontWeight: "800" }}>
                Select an Artist
            </Highlight>
        </Heading>
    );
};

export default ArtistBarHeader;