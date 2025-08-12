import { Heading, Highlight } from "@chakra-ui/react";

const GenreSelHeader = () => {
    return(
        <Heading fontSize={{ base:"4xl", sm: "6xl", md: "75px", lg:"75px"}} userSelect="none" letterSpacing="wider"
            fontFamily="'Barlow Condensed'" fontWeight="600" lineHeight={1} textAlign="center">
            <Highlight query="Genre" styles={{ fontSize:{ base: "5xl", sm:"65px", md: "85px", lg:"85px" }, 
            bgGradient: "to-br", bgClip: "text", gradientFrom: "teal.500", gradientTo: "green.500", fontWeight: "800" }}>
                Select a Genre
            </Highlight>
        </Heading>
    );
};

export default GenreSelHeader;