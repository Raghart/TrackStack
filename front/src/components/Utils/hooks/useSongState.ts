import { useEffect } from "react";
import { useAppSelector } from "../redux-hooks";

const useSongState = (audioRef: React.RefObject<HTMLAudioElement>) => {
    const { activeSong, isPlaying } = useAppSelector(state => state.songs.songState);

    useEffect(() => {
        if (!audioRef.current || !activeSong) return;
        audioRef.current.src = activeSong.url_preview;

        if (isPlaying) {
            audioRef.current.play();
        }
    }, [activeSong, audioRef, isPlaying]);

    useEffect(() => {
        if (!audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.play().catch((err) => {
                console.warn("Play failed", err.message);
            });
        } else {
            audioRef.current.pause();
        }
    },[isPlaying, audioRef]);

    return { activeSong, isPlaying };
};

export default useSongState;