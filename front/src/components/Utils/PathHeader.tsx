import { NavNameOptions } from "@/types/utilTypes";
import { Heading, Highlight } from "@chakra-ui/react";
import { ARTPATH_HEADER, ARTPATH_HIGHLIGHT } from "../constants/ArtistPathC";

const PathHeader = ({type}: {type: NavNameOptions}) => {
    switch (type) {
        case "Artists":
            return (
                <Heading fontSize={ARTPATH_HEADER} userSelect="none" lineHeight={1} letterSpacing="wider" 
                    fontFamily="'Barlow Condensed', sans-serif" fontWeight="600" textAlign="center">
                    <Highlight query="Artist" styles={{ fontSize: ARTPATH_HIGHLIGHT, fontStyle: "normal", bgGradient: "to-br", 
                        bgClip: "text", gradientFrom: "orange.500", gradientVia: "yellow.500", 
                        gradientTo: "orange.500", fontWeight: "800", letterSpacing: "wider" }}>
                        Select an Artist
                    </Highlight>
                </Heading>
            );
        case "Albums":
            return (
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
        case "Genres":
            return (
                <Heading fontSize={{ base:"4xl", sm: "6xl", md: "75px", lg:"75px"}} userSelect="none" 
                    letterSpacing="wider" fontFamily="'Barlow Condensed'" fontWeight="600" 
                    lineHeight={1} textAlign="center">
                    <Highlight query="Genre" styles={{ fontSize:{ base: "5xl", sm:"65px", md: "85px", 
                        lg:"85px" }, bgGradient: "to-br", bgClip: "text", gradientFrom: "teal.500", 
                        gradientTo: "green.500", fontWeight: "800" }}>
                        Select a Genre
                    </Highlight>
            </Heading>
        );
        default: 
            throw Error(`TYPE: '${type}' is not a valid home path type`)
    };
};

export default PathHeader;