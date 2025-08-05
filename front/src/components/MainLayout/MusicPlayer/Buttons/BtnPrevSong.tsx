import { Icon, IconButton } from "@chakra-ui/react";
import { PiSkipBackBold } from "react-icons/pi";
import { Tooltip } from "@/components/ui/tooltip";

const BtnPrevSong = ({ loadPrevSong } : { loadPrevSong: () => void }) => {
    return(
        <Tooltip showArrow content="Hear the prev. song" openDelay={300} closeDelay={0} 
            contentProps={{ css: { "--tooltip-bg": "colors.blue.500", color: "white" } }}>
            <IconButton bg="transparent" rounded="full" size={{ base: "xs", sm: "sm", md: "md", lg: "md"}}
                _hover={{ transform: "scale(1.1)", "& .icon-color": { color: "white" } }} onClick={loadPrevSong}
                data-testid="PrevSongBtn">
                <Icon className="icon-color" as={PiSkipBackBold} color="gray.300" />
            </IconButton>
        </Tooltip>
    );
};

export default BtnPrevSong;