import { GENRE_DETAILS_FONTSIZE, GENREDET_HEADER_FONTSIZE } from "@/components/constants/GenreDetailsC";
import { Heading, Highlight } from "@chakra-ui/react";

const GenreDetHeader = ({ genre } : { genre: string }) => {
    return(
        <Heading userSelect="none" fontSize={GENREDET_HEADER_FONTSIZE} fontWeight="600" letterSpacing="wider"
            fontFamily="'Barlow Condensed', sans-serif" lineHeight={1} w="full" maxW="full" lineClamp={2}>
            <Highlight query={genre} styles={{ bgGradient:"to-br", bgClip: "text", gradientFrom: "teal.500", 
                gradientTo: "green.500", fontSize: GENRE_DETAILS_FONTSIZE, fontWeight: "800", whiteSpace: "normal", 
                overflowWrap: "break-word", wordBreak: "break-word" }}>
                {`Genre: ${genre}`}
            </Highlight>
        </Heading>
    );
};

export default GenreDetHeader;