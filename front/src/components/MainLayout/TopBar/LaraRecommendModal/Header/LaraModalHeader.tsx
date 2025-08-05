import { LARA_HEADER_SIZES } from "@/components/constants/TopBarC";
import { Heading, Highlight } from "@chakra-ui/react";
import { Zoom } from "react-awesome-reveal";

const LaraModalHeader = () => {
    return(
        <Heading flex="1" mr={5} textAlign="center" color="white" letterSpacing="widest" lineHeight={1.2} 
            fontFamily="'Barlow Condensed', sans-serif" fontWeight="800" fontStyle="italic" truncate 
            fontSize={LARA_HEADER_SIZES} userSelect="none">
            <Zoom triggerOnce direction="right" delay={100}>
                <Highlight query="Lara" styles={{ bgGradient: "to-br", bgClip: "text", gradientFrom: "blue.500", 
                    gradientVia: "cyan.500", gradientTo: "blue.500", fontStyle: "normal", 
                    fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Lara Takes Over
                </Highlight>
            </Zoom>
        </Heading>  
    );
};

export default LaraModalHeader;