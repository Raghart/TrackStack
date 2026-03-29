import { SliderValueChangeDetails } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const useHandleVolume = (audioRef: React.RefObject<HTMLAudioElement>) => {
    const [volume, setVolume] = useState<number>(1);

    const handleVolumeChange = (e: SliderValueChangeDetails) => { 
            setVolume(e.value[0]);
            if (audioRef.current) { audioRef.current.volume = e.value[0] };
        };
    
        useEffect(() => { if (audioRef.current) { audioRef.current.volume = volume; }}, 
        [volume, audioRef]);
    
    return { volume, setVolume, handleVolumeChange };
};

export default useHandleVolume;