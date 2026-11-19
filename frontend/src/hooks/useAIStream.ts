import { useEffect, useRef, useState } from "react";
import { useSubscription } from "@apollo/client";
import type { ApolloError } from "@apollo/client";
import { aiSubscription } from "@/queries/LaraRecQuerie";
import { aiStreamChunkSchema, MAX_STRING_LENGTH } from "@trackstack/schemas/zod.parsers";
import { toaster } from "@/components/ui/toasterInstance";
import { useAppSelector } from "@/Utils/redux-hooks";
import { buildUserVector } from "@/Utils/buildUserVector";

const useAIStream = () => {
    const [aiResponse, setAIResponse] = useState<string>("");
    const [error, setError] = useState<ApolloError | null>(null);
    const errorNotified = useRef<boolean>(false);

    const { genres, energy, speechLevel, danceability, tempo, sentiment, voiceType,
            mood, acousticness } = useAppSelector(state => state.songData);
    const userVector = buildUserVector(tempo, danceability, energy, mood, speechLevel,
            acousticness, voiceType, sentiment);
    const userVectorKey = userVector.join(",");
    const streamKey = `${genres.join("\u0000")}|${userVectorKey}`;
    const activeStreamKey = useRef<string>(streamKey);

    useEffect(() => {
        activeStreamKey.current = streamKey;
        setAIResponse("");
        setError(null);
        errorNotified.current = false;
    }, [streamKey]);

    useSubscription(aiSubscription, {
        variables: { genres, userVector },
        shouldResubscribe: true,
        onData({ data }) {
            if (streamKey !== activeStreamKey.current) return;

            const parsedChunk = aiStreamChunkSchema.safeParse(data?.data?.aiResponse);
            if (!parsedChunk.success) {
                console.warn("Unable to parse the AI response chunk", parsedChunk.error);
                return;
            };
            const chunk = parsedChunk.data;
            if (chunk === "") return;
            if (chunk.length > MAX_STRING_LENGTH) {
                console.warn("The AI response chunk is too large and was ignored");
                return;
            }

            errorNotified.current = false;
            setError(null);
            setAIResponse(prev => (prev + chunk).slice(0, 100_000));
        },
        onError(err) {
            if (streamKey !== activeStreamKey.current) return;

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

    return { aiResponse, error };
};

export default useAIStream;
