import { Box, Flex, Image } from "@chakra-ui/react";
import { useState } from "react";
import LoadingBeat from "../../../Utils/LoadingBeat";
import BtnLandPlayLayer from "./BtnLandPlayLayer";
import { LAND_SONGCARD_SIZES } from "../../../constants/SongCardC";
import LandSongCardInfo from "./LandSongCardInfo";
import { SongResponse } from "@/types/songTypes";

const LandpageSongCard = ({ id, name, artists, url_preview, album_cover, isSongPlaying } : SongResponse & {
    isSongPlaying: boolean }) => {
    const [isLoading, SetIsLoading] = useState<boolean>(true);
    return(
    <Box borderRadius="md" border="2px solid #2D3748" position="relative" overflow="hidden" w="full" h="full"
        maxW={LAND_SONGCARD_SIZES}  transition="transform 0.3s ease" transform="translateZ(0)"
        willChange="transform, filter" backfaceVisibility="hidden"
        _hover={{ transform: "scale(1.015)", "& .hover-overlay": { opacity: 1 }, "& .hover-image": { 
        transform: "scale(1.1)", filter: "brightness(0.4) saturate(1.2) blur(2px)" } }} >
        
        <Image className="hover-image" src={album_cover} alt={`${name} cover`} h="full" w="full" objectFit="cover" 
            transition="opacity 0.5s ease" borderRadius="md" loading="lazy" onLoad={() => SetIsLoading(false)} 
            opacity={isLoading ? 0 : 1} willChange="transform, filter, opacity" backfaceVisibility="hidden" />

        {isLoading && (
            <Flex position="absolute" top="0" left={0} w="full" h="full" align="center" justify="center" 
                bg="rgba(0,0,0,0.5)">
                <LoadingBeat />
            </Flex>
        )}
        
        <BtnLandPlayLayer id={id} name={name} artists={artists} url_preview={url_preview} album_cover={album_cover}
            isSongPlaying={isSongPlaying} />

        <LandSongCardInfo id={id} name={name} artists={artists} />
    </Box>
    );
};

export default LandpageSongCard;