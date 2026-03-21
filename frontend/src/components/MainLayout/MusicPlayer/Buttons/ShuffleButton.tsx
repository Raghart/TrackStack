import { Icon, IconButton } from "@chakra-ui/react";
import { TbArrowsShuffle } from "react-icons/tb";
import { Tooltip } from "@/components/ui/tooltip"
import useStraySong from "@/components/Utils/hooks/useStraySong";

const ShuffleButton = () => {
    const getStraySong = useStraySong();
    return(
        <Tooltip showArrow content="Hear a random song" openDelay={300} closeDelay={0}
            contentProps={{ css: { "--tooltip-bg": "colors.blue.500", color: "white" } }}>
            <IconButton bg="transparent" rounded="full" size={{ base: "sm", sm: "sm", md: "md", lg: "md" }} 
                _hover={{ transform: "scale(1.1)", "& .icon-color": { color: "white" } }} 
                onClick={() => getStraySong()}>
                <Icon className="icon-color" as={TbArrowsShuffle} color="gray.300" />
            </IconButton>
        </Tooltip>
    );
};

export default ShuffleButton;