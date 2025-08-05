import { Box, Icon, IconButton } from "@chakra-ui/react";
import { useAppDispatch } from "../../../Utils/redux-hooks";
import handlePlayingSong from "../../../Utils/handlePlayingSong";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { SongResponse } from "@/types/songTypes";

const BtnLandPlayLayer = ({ id, name, album_cover, artists, url_preview, isSongPlaying } : SongResponse & 
    { isSongPlaying: boolean } ) => {
    const dispatch = useAppDispatch();
    return(
        <Box className="hover-overlay" position="absolute" inset={0} w="full" h="full" opacity={0} px={2} py={4} 
            bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(6px)" transition="opacity 0.3s ease" display="flex"
            flexDirection="column" justifyContent="center" alignItems="center" borderRadius="md" >

            <IconButton color="white" aria-label={isSongPlaying ? "Pause music" : "Play music"} boxSize="70px" 
                bg="blue.600" _hover={{ bg: "blue.500", transform:"scale(1.05)" }} borderRadius="full" mb={3} 
                onClick={() => dispatch(handlePlayingSong({id, name, album_cover, artists, url_preview}))} 
                aria-pressed={isSongPlaying} data-testid="Land-PlayBtn">

                <motion.div key={isSongPlaying ? "pause" : "play"} transition={{ duration: 0.2 }} 
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}> 
                    {isSongPlaying ? 
                    <Icon as={BsPauseFill} color="white" boxSize={12} /> : 
                    <Icon as={BsPlayFill} color="white" boxSize={12} /> }
                </motion.div>
            </IconButton>                                          
        </Box>
    );
};

export default BtnLandPlayLayer;