import { Box, Image, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useState } from "react";
import LoadingBeat from "../Utils/LoadingBeat";
import BtnPlayLayer from "./BtnPlayLayer";
import SongCardInfo from "./SongCardInfo";
import { SONGCARD_SIZES } from "../constants/SongCardC";
import { SongResponse } from "@/types/songTypes";

const SongCard = ({ id, name, artists, album_cover, url_preview, isSongPlaying } : SongResponse & 
    { isSongPlaying: boolean }) => {
    const [isLoading, SetIsLoading] = useState(true);
    const LOADINGBEAT_SIZES = useBreakpointValue({ base: 14, sm: 16, md: 18, lg: 20 });

    return (
        <Box borderRadius="md" border="2px solid #2D3748" position="relative" overflow="hidden" aspectRatio={3/4} 
            transition="transform 0.3s ease" maxW={SONGCARD_SIZES} _hover={{ "& .hover-overlay": { opacity: 1 }, 
            "& .hover-image": { transform: "scale(1.1)", filter: "brightness(0.4) saturate(1.2) blur(2px)" }, 
            transform: "scale(1.015)" }} data-testid="Songcard">
            
            <Image className="hover-image" src={album_cover} alt={`Cover of the song ${name}`} h="full" 
                w="full" objectFit="cover" transition="opacity 0.5s ease" borderRadius="md" loading="lazy"
                onLoad={() => SetIsLoading(false)} opacity={isLoading ? 0 : 1} />

            {isLoading && (
                <Flex position="absolute" top="0" left={0} w="full" h="full" align="center" justify="center" 
                    bg="rgba(0,0,0,0.5)">
                    <LoadingBeat size={LOADINGBEAT_SIZES} />
                </Flex>
            )}
            
            <BtnPlayLayer id={id} name={name} artists={artists} album_cover={album_cover} url_preview={url_preview} 
                isSongPlaying={isSongPlaying} />
            
            <SongCardInfo id={id} name={name} artists={artists} />   
        </Box>
    );
};

export default SongCard;