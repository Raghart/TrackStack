import { Box, Icon, IconButton } from "@chakra-ui/react";
import { useAppDispatch } from "../Utils/redux-hooks";
import handlePlayingSong from "../Utils/handlePlayingSong";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { SONGCARD_BTN_SIZES, SONGCARD_ICON_SIZES } from "../constants/SongCardC";
import { SongResponse } from "@/types/songTypes";

const BtnPlayLayer = ({ id, name, album_cover, artists, url_preview, isSongPlaying } : SongResponse 
    & { isSongPlaying: boolean }) => {
    const dispatch = useAppDispatch();
    return(
        <Box className="hover-overlay" position="absolute" inset={0} w="full" h="full" bg="rgba(0, 0, 0, 0.4)" 
            backdropFilter="blur(6px)" opacity={0} transition="opacity 0.3s ease" flexDirection="column" 
            display="flex" justifyContent="center" alignItems="center" borderRadius="md" px={2} py={4}>

            <IconButton color="white" aria-label={isSongPlaying ? "Pause music" : "Play music"} bg="blue.600" 
                _hover={{ bg: "blue.500", transform:"scale(1.05)" }} aria-pressed={isSongPlaying}
                onClick={() => dispatch(handlePlayingSong({id, name, album_cover, artists, url_preview}))} 
                borderRadius="full" mb={3} boxSize={SONGCARD_BTN_SIZES} data-testid="PlaySongBtn">
                <motion.div key={isSongPlaying ? "pause" : "play"} transition={{ duration: 0.2 }} 
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, 
                    scale: 0.8 }}> 
                    {isSongPlaying ? 
                    <Icon as={BsPauseFill} color="white" boxSize={SONGCARD_ICON_SIZES} /> : 
                    <Icon as={BsPlayFill} color="white" boxSize={SONGCARD_ICON_SIZES} /> }
                    </motion.div>
            </IconButton>                                          
        </Box>
    );
};

export default BtnPlayLayer;