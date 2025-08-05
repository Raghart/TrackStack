import { Flex, Icon, IconButton, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { GENRECARD_BTN_SIZES, GENRECARD_FONTSIZES, GENRECARD_ICON_SIZES } from "../constants/GenreDetailsC";
import { GenreListFormat } from "@/types/genreTypes";

const GenreCard = ({ name, icon }: GenreListFormat ) => {
    return(
        <IconButton as={LinkBox} asChild border="1px solid" p={{ base: 2, sm: 3, md: 3, lg: 3 }} bg="blue.800" 
            borderColor="blue.500" _hover={{ bg: "blue.900", "& .hover-icon": { color: "teal.600" } }} h="80px"
            w="full" maxW={GENRECARD_BTN_SIZES} transition="background-color 0.3s ease" alignContent="center" 
            borderRadius="2xl">

            <Flex align="center" justify="center" textAlign="center">
                <Icon className="hover-icon" as={icon} boxSize={GENRECARD_ICON_SIZES} color="teal.500" 
                    filter="drop-shadow(1px 1px 2px black)" />
                <LinkOverlay href={`/genres/${name}`} color="white" fontWeight="600" textDecoration="none" 
                    fontSize={GENRECARD_FONTSIZES} lineClamp={2} wordBreak="break-word" whiteSpace="normal" 
                    fontFamily="'Barlow', sans-serif">
                    {name}
                </LinkOverlay>
            </Flex>
        </IconButton>
    );
};

export default GenreCard;