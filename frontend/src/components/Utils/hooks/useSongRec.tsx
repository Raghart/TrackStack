import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../redux-hooks";
import { aiSubscription, streamAIAnswer } from "@/queries/LaraRecQuerie";
import { useMutation, useSubscription } from "@apollo/client";
import generateUserVector from "../generateUserVector";

const useSongRec = () => {
    const hasFetched = useRef(false);
    const [visibleCount, setVisibleCount] = useState<number>(20);
    const [aiResponse, setAIResponse] = useState<string>("");
    const [streamAnswer] = useMutation(streamAIAnswer);
    const { genres, energy, speechLevel, danceability, tempo, sentiment, voiceType, 
            mood, acousticness } = useAppSelector(state => state.songData);
    const recommendations = useAppSelector(state => state.songData.results);
    const visibleSongs = recommendations.slice(0, visibleCount);

    useSubscription(aiSubscription, {
        onData({ data }) {
            const chunkText = data.data.aiResponse;
            setAIResponse(prev => prev + chunkText)
        }
    });

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        setAIResponse("");
        const userVector = generateUserVector(tempo, danceability, energy, mood, speechLevel, 
            acousticness, voiceType, sentiment);
        streamAnswer({ variables: { genres, userVector } });
    }, []);

    const loadMoreSongs = () => {
        if (visibleSongs.length < recommendations.length) {
            setVisibleCount(prev => prev + 20);
        };
    };

    return { visibleSongs, recommendations, loadMoreSongs, aiResponse };
};

export default useSongRec;