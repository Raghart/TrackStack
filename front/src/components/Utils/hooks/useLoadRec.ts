import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux-hooks";
import { useLazyQuery } from "@apollo/client";
import { setLaraRecommendations } from "@/reducers/recommendReducer";
import { getIARecommendations } from "@/queries/LaraRecQuerie";

const useLoadRec = (setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const { genres, energy, speechLevel, danceability, duration, sentiment, voiceType, mood, acousticness } = 
        useAppSelector(state => state.songData);
    const dispatch = useAppDispatch();
    const [getIASongs] = useLazyQuery(getIARecommendations);
    
    const userVector = [energy, speechLevel, danceability, duration, sentiment, voiceType, mood, acousticness];
    
    const loadRecommendations = () => {
        setLoading(true);
        getIASongs({ variables: { genres, userVector}, 
            onCompleted: (data) => {
                if (data.getIARecommendations) {
                    dispatch(setLaraRecommendations(data.getIARecommendations));
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