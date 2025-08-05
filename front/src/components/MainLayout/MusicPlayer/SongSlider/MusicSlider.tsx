import useAudioData from "@/components/Utils/hooks/useAudioData";
import { Flex, Slider } from "@chakra-ui/react";
import PlayingTime from "./PlayingTime";
import SongDuration from "./SongDuration";

const MusicSlider = ({ audioRef, isPlaying }: { audioRef: React.RefObject<HTMLAudioElement>, isPlaying: boolean }) => {
    const { currentTime, duration, handleSongTime } = useAudioData(audioRef, isPlaying);
    return(
        <Flex align="center" gap="10px" maxW={{ base: "100%", md: "650px" }} w="100%" justify="center">
            <PlayingTime currentTime={currentTime} />

            <Slider.Root defaultValue={[0]} min={0} max={duration} size="sm" step={0.1} w="100%" minW="100px"
                variant="solid" value={[currentTime]} onValueChange={handleSongTime} cursor={isPlaying ? "pointer" : 
                "auto"} _hover={{ "& .slider-hover": { bg: "blue.500" } }} disabled={!isPlaying}>
                
                <Slider.Control>
                    <Slider.Track bg="gray.500" h="5px">
                        <Slider.Range className="slider-hover" bg="white" transition="background-color 0.2s ease" />
                    </Slider.Track>
                    <Slider.Thumbs boxSize={3} shadow="md" opacity={isPlaying ? "1" : "0"} />
                </Slider.Control>
            </Slider.Root>

            <SongDuration duration={duration} />
        </Flex>
    );
};

export default MusicSlider;