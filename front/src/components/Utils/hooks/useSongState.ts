import { useEffect } from "react";
import { useAppSelector } from "../redux-hooks";

const useSongState = (audioRef: React.RefObject<HTMLAudioElement>) => {
    const { activeSong, isPlaying } = useAppSelector(state => state.songs.songState);

    useEffect(() => {
        if (!audioRef.current || !activeSong) return;
        const audio = audioRef.current;
        audioRef.current.src = activeSong.url_preview;

        if (isPlaying) {
            const onCanPlay = () => { audio.play().catch(err => console.warn("Play failed", err.message)); };
            audio.addEventListener("canplay", onCanPlay, { once: true });
            return () => { audio.removeEventListener("canplay", onCanPlay); };
        };
    }, [activeSong, audioRef, isPlaying]);

    useEffect(() => {
        if (!audioRef.current) return;
        if (!isPlaying) { audioRef.current.pause(); };
    },[isPlaying, audioRef]);

    return { activeSong, isPlaying };
};

export default useSongState;