import { SONG_RESULTS_ICON_SIZES, SONG_RESULTS_IMG_SIZES } from "@/components/constants/TrackSearchC";
import { onPlayClick } from "@/components/Utils/onPlayClick";
import { useAppDispatch } from "@/components/Utils/redux-hooks";
import { SongResponse } from "@/types/songTypes";
import { Box, Icon, IconButton, Image, Skeleton } from "@chakra-ui/react";
import { useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";

const BtnPlaySearchSong = ({ song, isSongPlaying } : { song: SongResponse, isSongPlaying: boolean }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const dispatch = useAppDispatch();
    return(
        <Box position="relative" zIndex={1} cursor="pointer" _hover={{ "& .hover-button": { color: "blue.400" } }}
            onClick={(e) => dispatch(onPlayClick(e, song))}>
            <Skeleton position="absolute" loading={isLoading} rounded="full" boxSize={SONG_RESULTS_IMG_SIZES} />
            
            <Image src={song.album_cover} objectFit="cover" rounded="full" w="full" opacity={isLoading ? 0 : 1}
            alt={`Cover of ${song.name} by ${song.artists.join(", ")}`} onLoad={() => setIsLoading(false)} 
            transform={isLoading ? "scale(0.95)" : "scale(1)"} transition="opacity 0.3s ease, transform 0.3s ease" 
            boxSize={SONG_RESULTS_IMG_SIZES} />
            
            <IconButton className="hover-image" position="absolute" top="50%" left="50%" opacity={0} 
                bg="transparent" transform="translate(-50%, -50%)" pointerEvents={isLoading ? "none" : "auto"}
                transition="opacity 0.3s ease, transform 0.3s ease" aria-label={isSongPlaying ? "Resume Song" : 
                "Play song"}>
                {isSongPlaying ? 
                    <Icon as={BsPauseFill} className="hover-button" color="white" boxSize={SONG_RESULTS_ICON_SIZES} 
                        filter="drop-shadow(0 0 4px black)" transition="color 0.3s ease" /> : 
                    <Icon as={BsPlayFill} className="hover-button" color="white" transition="color 0.3s ease"
                        filter="drop-shadow(0 0 4px black)" boxSize={SONG_RESULTS_ICON_SIZES} /> 
                }
            </IconButton>
        </Box>
    );
};

export default BtnPlaySearchSong;