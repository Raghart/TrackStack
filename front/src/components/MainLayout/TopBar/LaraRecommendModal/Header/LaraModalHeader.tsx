import { LARA_HEADER_SIZES } from "@/components/constants/TopBarC";
import { Heading, Highlight } from "@chakra-ui/react";

const LaraModalHeader = () => {
    return(
        <Heading mr={5} textAlign="center" color="white" letterSpacing="widest" lineHeight={1} 
            fontFamily="'Barlow Condensed', sans-serif" fontWeight="800" fontStyle="italic" 
            fontSize={LARA_HEADER_SIZES} userSelect="none">
            <Highlight query="Lara" styles={{ bgGradient: "to-br", bgClip: "text", gradientFrom: "blue.500", 
                gradientVia: "cyan.500", gradientTo: "blue.500", fontStyle: "normal", 
                fontFamily: "'Barlow Condensed', sans-serif" }}>
                Lara Takes Over
            </Highlight>
        </Heading>  
    );
};

export default LaraModalHeader;