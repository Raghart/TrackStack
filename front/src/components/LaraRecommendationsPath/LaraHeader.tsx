import { Heading, Highlight } from "@chakra-ui/react";

const LaraHeader = () => {
    return(
        <Heading fontSize={{ base: "4xl", sm: "6xl", md: "7xl", lg: "7xl" }} fontWeight="bold" pt={2} 
            userSelect="none" letterSpacing="wider" lineHeight={1} textAlign="center" fontStyle="italic"
            fontFamily="'Barlow Condensed', sans-serif">
            <Highlight query="Lara's" styles={{ bgGradient: "to-br", bgClip: "text", gradientFrom: "blue.500", 
                gradientVia: "cyan.500", gradientTo: "blue.500", fontStyle: "normal",
                fontSize: { base: "4xl", sm: "6xl", md: "7xl", lg: "8xl" } }}>
                Lara's Music Match
            </Highlight>
        </Heading>
    );
};

export default LaraHeader;