import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux-hooks";
import { useLazyQuery } from "@apollo/client";
import { setLaraRecommendations } from "@/reducers/recommendReducer";
import { getSongRecommendations } from "@/queries/LaraRecQuerie";
import minMaxScale from "../minMaxScale";
import randInRange from "../randInRange";
import { acousticnessMAX, acousticnessMIN, danceabilityMax, danceabilityMin, durationMax, durationMin, energyMAX, energyMIN, instrumentalnessMAX, instrumentalnessMIN, livenessMAX, livenessMIN, loudnessMAX, 
    loudnessMIN, modeMax, modeMin, speechinessMAX, speechinessMIN, tempoMAX, tempoMIN, 
    timeSigMax, 
    timeSigMin, 
    trackKeyMAX, 
    trackKeyMIN,
    valenceMAX,
    valenceMIN} from "@/components/constants/ModalC";

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
    
    const durationNor = minMaxScale(duration, durationMin, durationMax);
    const danceabilityNor = minMaxScale(danceability, danceabilityMin, danceabilityMax);
    const energyNor = minMaxScale(energy, energyMIN, energyMAX);
    const trackKeyNor = minMaxScale(4, trackKeyMIN, trackKeyMAX);
    const loudnessNor = minMaxScale(loudness, loudnessMIN, loudnessMAX);
    const modeNor = minMaxScale(mood, modeMin, modeMax);
    const speechinessNor = minMaxScale(speechLevel, speechinessMIN, speechinessMAX);
    const acousticnessNor = minMaxScale(acousticness, acousticnessMIN, acousticnessMAX)
    const instrumentalnessNor = minMaxScale(voiceType, instrumentalnessMIN, instrumentalnessMAX)
    const livenessNor = minMaxScale(liveness, livenessMIN, livenessMAX)
    const valenceNor = minMaxScale(sentiment, valenceMIN, valenceMAX)
    const tempoNor = minMaxScale(tempo, tempoMIN, tempoMAX)
    const timeSigNor = minMaxScale(4, timeSigMin, timeSigMax)
    
    const userVector = [
        durationNor,
        danceabilityNor,
        energyNor,
        trackKeyNor,
        loudnessNor,
        modeNor,
        speechinessNor,
        acousticnessNor,
        instrumentalnessNor,
        livenessNor,
        valenceNor,
        tempoNor,
        timeSigNor,
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