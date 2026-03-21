import { getVolumeIconStyle } from "@/dynamicCSS/VolumeSliderStyle";
import { Icon, IconButton } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";

const BtnVolume = ({ volume, setVolume } : { volume: number, setVolume: React.Dispatch<React.SetStateAction<number>> }) => {
    const volumeIcon = getVolumeIconStyle(volume);
    return(
        <Tooltip showArrow content={volume !== 0 ? "Mute audio" : "Max audio"} openDelay={300} closeDelay={0}
            contentProps={{ css: { "--tooltip-bg": "colors.blue.500", color: "white" } }}>
            <IconButton bg="transparent" rounded="full" _hover={{ color: "white" }} 
            size={{ base: "xs", sm: "xs", md: "sm", lg: "sm" }} mr={{ base: 0, sm: 0, md: 1, lg: 1 }}
            onClick={() => volume === 0 ? setVolume(1) : setVolume(0)}>
                <Icon className="icon-color" as={volumeIcon} color="gray.300" />
            </IconButton>
        </Tooltip>
    );
};

export default BtnVolume;