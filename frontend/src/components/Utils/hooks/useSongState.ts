import { useEffect } from "react";
import { useAppSelector } from "../redux-hooks";
import { httpUrlSchema } from "@trackstack/schemas/zod.parsers";
import { parseDataOrUndefined } from "../safeParse";

const useSongState = (audioRef: React.RefObject<HTMLAudioElement>) => {
    const { activeSong, isPlaying } = useAppSelector(state => state.songs.songState);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const parsedUrl = activeSong
            ? parseDataOrUndefined(httpUrlSchema, activeSong.url_preview)
            : undefined;

        if (!parsedUrl) {
            if (audio.hasAttribute("src")) audio.removeAttribute("src");
            return;
        }

        if (audio.getAttribute("src") !== parsedUrl) audio.src = parsedUrl;
    }, [activeSong, audioRef]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!isPlaying) {
            audio.pause();
            return;
        }

        if (!audio.hasAttribute("src")) return;

        let disposed = false;
        const playSong = () => {
            if (disposed) return;
            audio.play().catch(err => console.warn("Play failed", err.message));
        };

        if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
            playSong();
            return () => { disposed = true; };
        }

        audio.addEventListener("canplay", playSong, { once: true });
        return () => {
            disposed = true;
            audio.removeEventListener("canplay", playSong);
        };
    }, [activeSong, audioRef, isPlaying]);

    return { activeSong, isPlaying };
};

export default useSongState;
