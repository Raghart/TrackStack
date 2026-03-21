import { SONGNAME_FONTSIZES, SONGNAME_SHADOW } from "@/components/constants/SongDetailsC";
import { Box, Heading } from "@chakra-ui/react";

const SongNameBox = ({ name }: { name: string }) => {
    return(
        <Box textAlign="center" _hover={{ "& .title-hover": { scale:"1.05", textShadow: SONGNAME_SHADOW } }}
            userSelect="none">
            <Heading className="title-hover" lineHeight={1} lineClamp={{ base: 3, sm: 2, md: 2, lg: 2 }}
                color="white" textShadow="0 0 5px var(--chakra-colors-blue-600)" fontSize={SONGNAME_FONTSIZES}
                transition="scale 0.3s ease, text-shadow 0.3s ease" fontFamily="'Barlow Condensed', sans-serif" 
                fontWeight="800">
                {name}
            </Heading>
        </Box>
    );
};

export default SongNameBox;