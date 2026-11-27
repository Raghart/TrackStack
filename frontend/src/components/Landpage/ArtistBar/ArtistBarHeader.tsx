import { Heading, Highlight } from "@chakra-ui/react";
import useTinyScreen from "@/hooks/useTinyScreen";

const ArtistBarHeader = () => {
    const isTinyScreen = useTinyScreen();
    return(
        <Heading fontFamily="'Barlow', sans-serif" fontWeight="600" letterSpacing="wide" userSelect="none" 
            pl={2} fontSize={isTinyScreen ? "18px" : undefined}>
            <Highlight query="Artist" styles={{ bgGradient: "to-br", bgClip: "text", gradientFrom: "orange.500", 
                gradientVia: "yellow.500", gradientTo: "orange.500", fontSize: isTinyScreen ? "20px" : "2xl", 
                fontStyle: "italic", fontWeight: "800" }}>
                Select an Artist
            </Highlight>
        </Heading>
    );
};

export default ArtistBarHeader;