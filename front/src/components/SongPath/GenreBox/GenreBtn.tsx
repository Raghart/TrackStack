import { GENREBOX_BTN_HOVER_SHADOW, GENREBOX_BTN_SHADOW, GENREBOX_FONTSIZE, GENREBOX_PX } from "@/components/constants/SongDetailsC";
import { Button, Link } from "@chakra-ui/react";

const GenreBtn = ({ genre } : { genre: string }) => {
    return(
        <Button border="2px solid transparent" bg="blackAlpha.600" borderRadius="full" letterSpacing="wider"
            transition="box-shadow 0.3s ease-in-out, opacity 0.3s ease-in-out" color="green.400" fontStyle="italic" 
            boxShadow={GENREBOX_BTN_SHADOW} _hover={{ boxShadow: GENREBOX_BTN_HOVER_SHADOW, opacity: 0.85, 
            textDecoration:"none"}} px={GENREBOX_PX} size={{ base: "2xs", sm:  "2xs", md: "2xs", lg: "sm" }} asChild>
                <Link href={`/genres/${genre}`} fontFamily="'Barlow', sans-serif" fontWeight="700" 
                    fontSize={GENREBOX_FONTSIZE}>
                    {genre}
                </Link>
        </Button>
    );
};

export default GenreBtn;