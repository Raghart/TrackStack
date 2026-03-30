import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../redux-hooks";
import { aiSubscription, streamAIAnswer } from "@/queries/LaraRecQuerie";
import { useMutation, useSubscription } from "@apollo/client";
import generateUserVector from "../generateUserVector";

const useSongRec = () => {
    const [visibleCount, setVisibleCount] = useState<number>(20);
    const [streamAnswer] = useMutation(streamAIAnswer);
    const [message, setMessage] = useState("");
    const { genres, energy, speechLevel, danceability, tempo, sentiment, voiceType, 
            mood, acousticness } = useAppSelector(state => state.songData);
    useSubscription(aiSubscription, {
        onData({ data }) {
            const chunkText = data.data.aiResponse;
            setMessage(prev => prev + chunkText)
        }
    });

    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        setMessage("");
        const userVector = generateUserVector(tempo, danceability, energy, mood, speechLevel, 
            acousticness, voiceType, sentiment);
        streamAnswer({ variables: { genres, userVector } });
    }, []);
    const recommendations = useAppSelector(state => state.songData.results);
    const aiResponse = useAppSelector(state => state.songData.message);
    const visibleSongs = recommendations.slice(0, visibleCount);

    const loadMoreSongs = () => {
        if (visibleSongs.length < recommendations.length) {
            setVisibleCount(prev => prev + 20);
        };
    };

    return { visibleSongs, recommendations, loadMoreSongs, message };
};

export default useSongRec;