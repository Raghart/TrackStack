import ArtistLinks from "@/components/Utils/ArtistLinks";
import { Flex, Image, SkeletonCircle, SkeletonText, VStack } from "@chakra-ui/react";
import { ACT_SONG_WIDTH } from "@/components/constants/MusicPlayerC";
import ActSongTitle from "./ActSongTitle";
import { SongResponse } from "@/types/songTypes";

const ActiveSongInfo = ({ activeSong } : { activeSong: SongResponse | null }) => {
    return(
        <Flex userSelect="none" gap={2} align="center" w="full" ml={{ base: 1, sm: 2, md: 3, lg: 4 }} 
            maxW={ACT_SONG_WIDTH}>
            {activeSong ? (
                <>
                    <Image src={activeSong.album_cover} transition="transform 0.2s ease" boxSize="40px" 
                        borderRadius="full" _hover={{ transform: "scale(1.05)" }} hideBelow="sm" />
                    <VStack gap={0} align="flex-start" maxW="210px">
                        <ActSongTitle {...activeSong} />
                        <ArtistLinks artists={activeSong.artists} size="13px" color="gray.400" fontWeight="600"
                        font="'Barlow', sans-serif" lineClamp={1} hoverColor="white" txtDecor={true} />
                    </VStack>
                </>
            ) : (
                <>
                    <SkeletonCircle bg="gray" size="40px" />
                    <SkeletonText noOfLines={2} w="full" maxW={ACT_SONG_WIDTH} bg="gray" />
                </>
            )}
        </Flex>
    );
};

export default ActiveSongInfo;