import { useAppDispatch } from "@/components/Utils/redux-hooks";
import { togglePlayAudio } from "@/reducers/songReducer";
import { Flex } from "@chakra-ui/react";
import { useRef } from "react";
import MusicSlider from "./SongSlider/MusicSlider";
import ShuffleButton from "./Buttons/ShuffleButton";
import PlayControls from "./Buttons/PlayControls";
import ActiveSongInfo from "./SongInfo/ActiveSongInfo";
import useSongState from "@/components/Utils/hooks/useSongState";
import { VOLUME_SLID_SIZES } from "@/components/constants/MusicPlayerC";
import VolumeSlider from "./VolumeSlider/VolumeSlider";

const MusicPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null!);
    const { activeSong, isPlaying } = useSongState(audioRef);
    const dispatch = useAppDispatch();
    return(
        <Flex position="fixed" bg="blackAlpha.800" zIndex={3} bottom={0} left={0} h="55px" w="full" align="center"
            border="2px solid" borderColor="gray.800" data-testid="musicPlayer">

            <ActiveSongInfo activeSong={activeSong} />
            
            <Flex w="100%" justify="center">
                <PlayControls activeSong={activeSong} isPlaying={isPlaying} />
                <MusicSlider audioRef={audioRef} isPlaying={isPlaying} />
            </Flex>

            <Flex mr={4} w="100%" maxW={VOLUME_SLID_SIZES}>
                <ShuffleButton />
                <VolumeSlider audioRef={audioRef} />
            </Flex>

            <audio data-testid="AudioPlayer" ref={audioRef} onEnded={() => dispatch(togglePlayAudio())} />
        </Flex>
    );
};

export default MusicPlayer;