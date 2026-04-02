import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../redux-hooks";
import { aiSubscription, streamAIAnswer } from "@/queries/LaraRecQuerie";
import { useMutation, useSubscription } from "@apollo/client";
import generateUserVector from "../generateUserVector";

const useSongRec = () => {
    const hasFetched = useRef(false);
    const [visibleCount, setVisibleCount] = useState<number>(20);
    const [aiResponse, setAIResponse] = useState<string>("");
    const [isSub, setIsSub] = useState(false);
    const [streamAnswer] = useMutation(streamAIAnswer);
    const { genres, energy, speechLevel, danceability, tempo, sentiment, voiceType, 
            mood, acousticness } = useAppSelector(state => state.songData);
    const recommendations = useAppSelector(state => state.songData.results);
    const visibleSongs = recommendations.slice(0, visibleCount);
    const userVector = generateUserVector(tempo, danceability, energy, mood, speechLevel, 
            acousticness, voiceType, sentiment);

    const { loading } = useSubscription(aiSubscription, {
        onData({ data }) {
            const chunkText = data.data.aiResponse;
            console.log(chunkText);
            setAIResponse(prev => prev + chunkText)
        },
    });

    useEffect(() => {
        const timer = setTimeout(() => setIsSub(false), 500);
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (hasFetched.current || !loading || !isSub) return;
        hasFetched.current = true;
        setAIResponse("");
        console.log("using stream answer!")
        streamAnswer({ variables: { genres, userVector } });
    }, [genres, userVector, streamAnswer, loading, isSub]);

    const loadMoreSongs = () => {
        if (visibleSongs.length < recommendations.length) {
            setVisibleCount(prev => prev + 20);
        };
    };

    return { visibleSongs, recommendations, loadMoreSongs, aiResponse };
};

export default useSongRec;