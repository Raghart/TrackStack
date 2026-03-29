import { Icon, IconButton } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { PiSkipForwardBold } from "react-icons/pi";

const BtnNextSong = ({ loadNextSong } : { loadNextSong: () => void }) => {
    return(
        <Tooltip showArrow content="Hear the next song" openDelay={300} closeDelay={0}
            contentProps={{ css: { "--tooltip-bg": "colors.blue.500", color: "white" } }}>
            <IconButton bg="transparent" rounded="full" size={{ base: "xs", sm: "sm", md: "md", lg: "md" }} 
            _hover={{ transform: "scale(1.1)", "& .icon-color": { color: "white" } }} onClick={loadNextSong}
            data-testid="NextSongBtn">
                <Icon className="icon-color" as={PiSkipForwardBold} color="gray.300" />
            </IconButton>
        </Tooltip>
    );
};

export default BtnNextSong;