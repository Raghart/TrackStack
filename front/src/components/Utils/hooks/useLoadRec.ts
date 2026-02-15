import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux-hooks";
import { useLazyQuery } from "@apollo/client";
import { setLaraRecommendations } from "@/reducers/recommendReducer";
import { getSongRecommendations } from "@/queries/LaraRecQuerie";
import minMaxScale from "../minMaxScale";
import { MAXDURATION, maxLoudness, maxTempo, MINDURATION, minLoudness, minTempo, 
    TIMESIGNATURENOR, TRACKKEYNOR } from "@/components/constants/ModalC";
import randInRange from "../randInRange";

const useLoadRec = (setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const { genres, energy, speechLevel, danceability, duration, sentiment, voiceType, mood, acousticness } = 
        useAppSelector(state => state.songData);
    const dispatch = useAppDispatch();
    const [getIASongs] = useLazyQuery(getSongRecommendations);
    
    const liveness = mood === 1 ? randInRange(0.6, 0.9) : randInRange(0.05, 0.3);
    const tempo = sentiment > 0.5 ? randInRange(120, 150) : randInRange(70, 100);
    const loudness = mood === 1 ? randInRange(-6, -3) : randInRange(-14, -8);
    
    const durationNor = minMaxScale(duration, MINDURATION, MAXDURATION)
    const loudnessNor = minMaxScale(loudness, minLoudness, maxLoudness)
    const tempoNor = minMaxScale(tempo, minTempo, maxTempo)
    
    const userVector = [
        durationNor,
        danceability,
        energy,
        TRACKKEYNOR,
        loudnessNor,
        mood,
        speechLevel,
        acousticness,
        voiceType, 
        liveness,
        sentiment,
        tempoNor,
        TIMESIGNATURENOR,
    ];

    const limit = 40;
    
    const loadRecommendations = () => {
        setLoading(true);
        getIASongs({ variables: { genres, userVector, limit }, 
            onCompleted: (data) => {
                if (data.getSongRecommendations) {
                    dispatch(setLaraRecommendations(data.getSongRecommendations));
                    navigate("/recommendations");
                    setLoading(false);
                    setOpen(false);
                };
            },
        });
    };

    return { loadRecommendations, loading }
};

export default useLoadRec;