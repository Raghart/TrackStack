import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux-hooks";
import { useLazyQuery } from "@apollo/client";
import { setLaraRecommendations } from "@/reducers/recommendReducer";
import { getSongRecommendations } from "@/queries/LaraRecQuerie";
import generateUserVector from "../generateUserVector";
import { songResponseSchema } from "@trackstack/schemas";
import { parseArrayOrEmpty } from "../safeParse";
import { toaster } from "@/components/ui/toasterInstance";

const useLoadRecommendations = (setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { genres, energy, speechLevel, danceability, tempo, sentiment, voiceType, 
            mood, acousticness } = useAppSelector(state => state.songData);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const [getIASongs] = useLazyQuery(getSongRecommendations);
    const userVector = generateUserVector(tempo, danceability, energy, mood, speechLevel,
        acousticness, voiceType, sentiment);
    const limit = 40;
    
    const loadRecommendations = async () => {
        setLoading(true);
        try {
            const { data } = await getIASongs({ variables: { genres, userVector, limit } });
            const songRecommendations = parseArrayOrEmpty(songResponseSchema, data?.getSongRecommendations);
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
            console.error("Unable to get the song recommendations", err);
            toaster.create({
                type: "error",
                title: "Something went wrong",
                description: "We couldn't load your recommendations. Please try again.",
                meta: { closable: true },
            });
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return { loadRecommendations, loading }
};

export default useLoadRecommendations;