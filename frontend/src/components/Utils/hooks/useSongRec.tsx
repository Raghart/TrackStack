import { useState } from "react";
import { useAppSelector } from "../redux-hooks";
import { responseSub } from "@/queries/LaraRecQuerie";
import { useSubscription } from "@apollo/client";
import generateUserVector from "../generateUserVector";

const useSongRec = () => {
    const [visibleCount, setVisibleCount] = useState<number>(20);
    const [aiResponse, setAIResponse] = useState<string>("");
    const { genres, energy, speechLevel, danceability, tempo, sentiment, voiceType, 
            mood, acousticness } = useAppSelector(state => state.songData);
    const userVector = generateUserVector(tempo, danceability, energy, mood, speechLevel, 
            acousticness, voiceType, sentiment);

    useSubscription(responseSub, {
        variables: { genres, userVector },
        onData({ data }) {
            console.log(data)
            const chunkText = data.data.responseSub;
            setAIResponse(prev => prev + chunkText);
        }
    });

    const recommendations = useAppSelector(state => state.songData.results);
    const visibleSongs = recommendations.slice(0, visibleCount);

    const loadMoreSongs = () => {
        if (visibleSongs.length < recommendations.length) {
            setVisibleCount(prev => prev + 20);
        };
    };

    return { visibleSongs, recommendations, loadMoreSongs, aiResponse };
};

export default useSongRec;