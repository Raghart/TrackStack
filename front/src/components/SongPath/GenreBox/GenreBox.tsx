import { Box, Wrap, WrapItem, For, Heading, useBreakpointValue } from "@chakra-ui/react";
import GenreBtn from "./GenreBtn";
import BtnGenreMax from "./BtnGenreMax";
import { Bounce } from "react-awesome-reveal";
import { GENREBOX_PADDING, GENREBOX_SHADOW } from "@/components/constants/SongDetailsC";

const GenreBox = ({ genres }: { genres: string[] }) => {
    const responsiveGenres = useBreakpointValue({ base: 3, sm: 8, md: 8, lg: 12 }) ?? 12;
    return (
        <Box p={GENREBOX_PADDING} textAlign="center" border="6px solid" color="white" borderColor="green.600" 
            transition="transform 0.3s ease, box-shadow 0.3s ease" borderRadius="xl" backdropFilter="blur(10px)" 
            h="full" w='full' maxW="full" _hover={{ transform: "scale(1.05)", boxShadow: GENREBOX_SHADOW }}>
            
            <Bounce triggerOnce direction="right" delay={100}>
                <Heading fontSize="3x1" color="green.500" letterSpacing="widest" userSelect="none" fontWeight="700" 
                    lineHeight={1} mt={3} fontFamily="'Barlow Condensed', sans-serif" textShadow="0 1px 3px black">
                    GENRES
                </Heading>

                <Wrap gap={2} justify="center" mt={3}>
                    <For each={genres.slice(0, responsiveGenres)}>
                        {(genre: string, idx: number) => (
                            <WrapItem key={genre}>
                                <GenreBtn genre={genre} />
                                {genres.length > responsiveGenres && idx === responsiveGenres - 1 && (
                                    <BtnGenreMax genLength={genres.length} maxGenres={responsiveGenres} />
                                )}  
                            </WrapItem>
                        )}
                    </For>
                </Wrap>
            </Bounce>
        </Box>
    );
};

export default GenreBox;