import { useAppDispatch } from "@/components/Utils/redux-hooks";
import { togglePlayAudio } from "@/reducers/songReducer";
import { Icon, IconButton } from "@chakra-ui/react";
import { LuPause, LuPlay } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";

const BtnPlaySong = ({ isPlaying } : { isPlaying: boolean }) => {
    const dispatch = useAppDispatch();
    return(
        <Tooltip showArrow content={isPlaying ? "Pause song" : "Play song"} openDelay={400} closeDelay={0}
            contentProps={{ css: { "--tooltip-bg": "colors.blue.500", color: "white" } }}>
            <IconButton borderRadius="full" bg="blue.600" onClick={() => dispatch(togglePlayAudio())}
                _hover={{ bg: "blue.700", "& .hover-button": { color: "gray.200" } }} data-testid="PlayBtn"
                aria-label={isPlaying ? "Pause" : "Play"} size={{ base: "xs", sm: "sm", md: "md", lg: "md" }}>
                {isPlaying ? 
                <Icon as={LuPause} className="hover-button" color="white" /> : 
                <Icon className="hover-button" as={LuPlay} color="white" /> }
            </IconButton>
        </Tooltip>
    );
};

export default BtnPlaySong;