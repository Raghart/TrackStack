import { Heading, Highlight } from "@chakra-ui/react";

const GenreBarHeader = () => {
    return(
        <Heading fontWeight="600" letterSpacing="wide" userSelect="none" pl={2} fontFamily="'Barlow', sans-serif">
            <Highlight query="Genre" styles={{ bgGradient: "to-br", bgClip: "text", gradientFrom: "teal.300", 
                gradientVia: "green.500", gradientTo: "teal.300", fontStyle: "italic", fontSize: "25px", 
                fontWeight: "800" }}>
                Select a Genre
            </Highlight>
        </Heading>
    );
};

export default GenreBarHeader;