import { Flex, Slider } from "@chakra-ui/react";
import BtnVolume from "./BtnVolume";
import { VOL_THUMB_SIZES } from "@/components/constants/MusicPlayerC";
import useHandleVolume from "@/components/Utils/hooks/useHandleVolume";

const VolumeSlider = ({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement> }) => {
    const { volume, setVolume, handleVolumeChange } = useHandleVolume(audioRef);
    return(
        <Flex align="center" _hover={{ "& .hover-volume": { opacity: 1 }, "& .icon-color": { color: "white"} }}
            w="100%" flexWrap="nowrap">
            <BtnVolume volume={volume} setVolume={setVolume} />

            <Slider.Root flex="1" w="100%" defaultValue={[1]} min={0} max={1} variant="solid" step={0.01}
                style={{ cursor: "pointer" }} value={[volume]} onValueChange={handleVolumeChange}
                _hover={{ "& .slider-bg": { bg: "blue.500" } }}>
                <Slider.Control>
                    <Slider.Track bg="gray.400" h="4px">
                        <Slider.Range className="slider-bg" bg="white" transition="background 0.2s ease" />
                    </Slider.Track>
                    <Slider.Thumbs className="hover-volume" borderColor="white" shadow="md" opacity={0} 
                        boxSize={VOL_THUMB_SIZES} bg="white" />
                </Slider.Control>
            </Slider.Root>
        </Flex>
    );
};

export default VolumeSlider;