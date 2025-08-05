import { SONG_ICON_SIZES, SONG_IMG_SIZES } from "@/components/constants/TrackSearchC";
import { onPlayClick } from "@/components/Utils/onPlayClick";
import { useAppDispatch } from "@/components/Utils/redux-hooks";
import useActSongState from "@/components/Utils/hooks/useActSongState";
import { Box, Icon, IconButton, Image, Skeleton } from "@chakra-ui/react";
import { useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { SongResponse } from "@/types/songTypes";

const PlaySongBox = ({ id, name, artists, album_cover, url_preview } : SongResponse) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isSongPlaying = useActSongState(id);
    const dispatch = useAppDispatch();
    return(
        <Box position="relative" onClick={(e) => dispatch(onPlayClick(e, { id, name, artists, album_cover, 
            url_preview }))} cursor="pointer" _hover={{ "& .hover-button": { color: "blue.400" } }}>

            <Skeleton position="absolute" loading={isLoading} rounded="full" boxSize={SONG_IMG_SIZES} />

            <Image src={album_cover} objectFit="cover" alt={`Album cover of the song ${name}`} rounded="full" 
            onLoad={() => setIsLoading(false)} opacity={isLoading ? 0 : 1} boxSize={SONG_IMG_SIZES}
            transition="opacity 0.5s ease, transform 0.5s ease" transform={isLoading ? "scale(0.95)" : "scale(1)"} />
            
            <IconButton className="hover-play" position="absolute" opacity={0} bg="transparent"
                transform="translate(-50%, -50%)" transition="transform 0.3s ease" top="50%" left="50%"
                borderRadius="full"  zIndex={1} size="2xl" aria-pressed={isSongPlaying}
                pointerEvents={isLoading ? "none" : "auto"}>
                {isSongPlaying ?
                    <Icon as={BsPauseFill} color="white" className="hover-button" transition="color 0.3s ease"  
                    boxSize={SONG_ICON_SIZES} filter="drop-shadow(0 0 4px black)"/> : 
                    <Icon as={BsPlayFill} color="white" className="hover-button" transition="color 0.3s ease" 
                    boxSize={SONG_ICON_SIZES} filter="drop-shadow(0 0 4px black)" />
                }
            </IconButton>         
        </Box>
    );
};

export default PlaySongBox;