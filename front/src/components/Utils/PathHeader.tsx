import { NavNameOptions } from "@/types/utilTypes";
import { Heading, Highlight } from "@chakra-ui/react";
import { PATH_HEADER_SIZES, PATH_HIGHLIGHT_SIZES } from "../constants/ArtistPathC";

const PathHeader = ({type}: {type: NavNameOptions}) => {
    switch (type) {
        case "Artists":
            return (
                <Heading fontSize={PATH_HEADER_SIZES} userSelect="none" lineHeight={1} 
                    letterSpacing="wider" fontFamily="'Barlow Condensed', sans-serif" 
                    fontWeight="600" textAlign="center">
                    <Highlight query="Artist" styles={{ fontSize: PATH_HIGHLIGHT_SIZES, 
                        fontStyle: "normal", bgGradient: "to-br", bgClip: "text", 
                        gradientFrom: "orange.500", gradientVia: "yellow.500", 
                        gradientTo: "orange.500", fontWeight: "800", letterSpacing: "wider" }}>
                        Select an Artist
                    </Highlight>
                </Heading>
            );
        case "Albums":
            return (
                <Heading fontSize={PATH_HEADER_SIZES} userSelect="none" lineHeight={1} 
                    letterSpacing="wider" fontFamily="'Barlow Condensed', sans-serif" fontWeight="600" 
                    textAlign="center">
                <Highlight query="Album" styles={{ fontSize: PATH_HIGHLIGHT_SIZES, fontStyle: "normal", 
                    bgGradient: "to-br", bgClip: "text", gradientFrom: "yellow.500", 
                    gradientVia: "orange.500", gradientTo: "yellow.500", fontWeight: "800", 
                    letterSpacing: "wider" }}>
                    Select an Album
                </Highlight>
            </Heading>
        );
        case "Genres":
            return (
                <Heading fontSize={PATH_HEADER_SIZES} userSelect="none" letterSpacing="wider" 
                    fontFamily="'Barlow Condensed'" fontWeight="600" lineHeight={1} textAlign="center">
                    <Highlight query="Genre" styles={{ fontSize: PATH_HIGHLIGHT_SIZES, 
                        bgGradient: "to-br", bgClip: "text", gradientFrom: "teal.500", 
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