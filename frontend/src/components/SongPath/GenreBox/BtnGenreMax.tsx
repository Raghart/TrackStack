import { GENREBOX_BTNMAX_FONTSIZE, GENREBOX_BTNMAX_SHADOW, GENREBOX_BTNMAX_SHADOW_HOVER, GENREBOX_PX } from "@/components/constants/SongDetailsC";
import { Button } from "@chakra-ui/react";

const BtnGenreMax = ({ genLength, maxGenres } : { genLength: number, maxGenres: number }) => {
    return(
        <Button ml={1} border="2px solid transparent" bg="blackAlpha.600" color="green.400" px={GENREBOX_PX}
            borderRadius="full"transition="box-shadow 0.3s ease-in-out, opacity 0.3s ease-in-out" fontWeight="700" 
            boxShadow={GENREBOX_BTNMAX_SHADOW} _hover={{ opacity: 0.85, textDecoration: "none", 
            boxShadow: GENREBOX_BTNMAX_SHADOW_HOVER }} size={{ base: "2xs", sm: "2xs", md: "2xs", lg: "sm" }}
            fontSize={GENREBOX_BTNMAX_FONTSIZE} fontStyle="italic" hideBelow="sm">
                +{genLength - maxGenres} more
        </Button>  
    );
};

export default BtnGenreMax;