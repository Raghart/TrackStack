import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../redux-hooks";
import { useSubscription } from "@apollo/client";
import type { ApolloError } from "@apollo/client";
import generateUserVector from "../generateUserVector";
import { aiSubscription } from "@/queries/LaraRecQuerie";
import { aiStreamChunkSchema } from "@trackstack/schemas/zod.parsers";
import { toaster } from "@/components/ui/toasterInstance";

const useSongRecommendations = () => {
    const [visibleCount, setVisibleCount] = useState<number>(20);
    const [aiResponse, setAIResponse] = useState<string>("");
    const [error, setError] = useState<ApolloError | null>(null);
    const errorNotified = useRef<boolean>(false);
    const { genres, energy, speechLevel, danceability, tempo, sentiment, voiceType, 
            mood, acousticness } = useAppSelector(state => state.songData);
    const userVector = generateUserVector(tempo, danceability, energy, mood, speechLevel, 
            acousticness, voiceType, sentiment);
    const userVectorKey = userVector.join(",");

    useEffect(() => {
        setAIResponse("");
        setError(null);
        errorNotified.current = false;
    }, [genres, userVectorKey]);

    useSubscription(aiSubscription, {
        variables: { genres, userVector },
        shouldResubscribe: true,
        onData({ data }) {
            const parsedChunk = aiStreamChunkSchema.safeParse(data?.data?.aiResponse);
            if (!parsedChunk.success) {
                console.warn("Unable to parse the AI response chunk", parsedChunk.error);
                return;
            };
            if (parsedChunk.data === "") return;

            errorNotified.current = false;
            setError(null);
            setAIResponse(prev => prev + parsedChunk.data);
        },
        onError(err) {
            console.error("Unable to get the AI recommendations", err);
            setError(err);
            if (errorNotified.current) return;

            errorNotified.current = true;
            toaster.create({
                type: "error",
                title: "Something went wrong",
                description: "We couldn't get Lara's recommendations. Please try again later.",
                meta: { closable: true },
            });
        }
    });

    const recommendations = useAppSelector(state => state.songData.results);
    const visibleSongs = recommendations.slice(0, visibleCount);

    const loadMoreSongs = () => {
        if (visibleSongs.length < recommendations.length) {
            setVisibleCount(prev => prev + 20);
        };
    };

    return { visibleSongs, recommendations, loadMoreSongs, aiResponse, error };
};

export default useSongRecommendations;
