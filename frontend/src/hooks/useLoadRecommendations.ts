import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux-hooks";
import { useLazyQuery } from "@apollo/client";
import { setLaraRecommendations } from "@/reducers/recommendReducer";
import { getSongRecommendations } from "@/queries/LaraRecQuerie";
import generateUserVector from "../generateUserVector";
import { songResponseSchema } from "@trackstack/schemas";
import { parseDataOrUndefined } from "../safeParse";
import { toaster } from "@/components/ui/toasterInstance";

const useLoadRecommendations = (setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { genres, energy, speechLevel, danceability, tempo, sentiment, voiceType, 
            mood, acousticness } = useAppSelector(state => state.songData);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const requestIdRef = useRef(0);
    
    const [getIASongs] = useLazyQuery(getSongRecommendations);
    const userVector = useMemo(() => generateUserVector(tempo, danceability, energy, mood, speechLevel,
        acousticness, voiceType, sentiment), [tempo, danceability, energy, mood, speechLevel,
        acousticness, voiceType, sentiment]);
    const limit = 40;
    
    const loadRecommendations = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        setLoading(true);
        try {
            const { data, error } = await getIASongs({ variables: { genres, userVector, limit } });
            if (requestId !== requestIdRef.current) return;
            if (error) throw error;

            const songRecommendations = parseDataOrUndefined(
                songResponseSchema.array(), data?.getSongRecommendations);
            if (!songRecommendations) {
                toaster.create({
                    type: "error",
                    title: "Recommendations unavailable",
                    description: "We received an unexpected response. Please try again.",
                    meta: { closable: true },
                });
                return;
            };
            if (songRecommendations.length === 0) {
                toaster.create({
                    type: "error",
                    title: "No recommendations found",
                    description: "We couldn't find songs with those filters. Try adjusting your options.",
                    meta: { closable: true },
                });
                return;
            };
            dispatch(setLaraRecommendations(songRecommendations));
            navigate("/recommendations");
        } catch (err) {
            if (requestId !== requestIdRef.current) return;
            console.error("Unable to get the song recommendations", err);
            toaster.create({
                type: "error",
                title: "Something went wrong",
                description: "We couldn't load your recommendations. Please try again.",
                meta: { closable: true },
            });
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading(false);
                setOpen(false);
            }
        }
    }, [dispatch, genres, getIASongs, limit, navigate, setOpen, userVector]);

    return { loadRecommendations, loading }
};

export default useLoadRecommendations;
