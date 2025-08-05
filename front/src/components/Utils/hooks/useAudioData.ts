import { SliderValueChangeDetails } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const useAudioData = (audioRef: React.RefObject<HTMLAudioElement>, isPlaying: boolean) => {
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(30);

    const handleSongTime = (e: SliderValueChangeDetails) => {
         setCurrentTime(e.value[0]);
        if (audioRef.current) { audioRef.current.currentTime = e.value[0] };
    };
    
    useEffect(() => {
        const audio = audioRef.current
        if (audio) {
            const handleLoadedMetaData = () => { setDuration(audio.duration) }
            audio.addEventListener("loadedmetadata", handleLoadedMetaData);
            return () => { audio.removeEventListener("loadedmetadata", handleLoadedMetaData) }
        };
    },[audioRef])

    useEffect(() => {
        if (audioRef.current) {
            let animationFrameId: number;
            const updateCurrentTime = () => {
                if (audioRef.current && isPlaying) {
                    setCurrentTime(audioRef.current.currentTime);
                    animationFrameId = requestAnimationFrame(updateCurrentTime);
                }
            };
            if (isPlaying) { animationFrameId = requestAnimationFrame(updateCurrentTime); }
            return () => cancelAnimationFrame(animationFrameId);
        };
    }, [isPlaying, audioRef]);

    return { currentTime, duration, handleSongTime }
};

export default useAudioData;