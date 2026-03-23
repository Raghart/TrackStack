import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux-hooks";
import { useLazyQuery } from "@apollo/client";
import { setLaraRecommendations, setMessage } from "@/reducers/recommendReducer";
import { getAIResponse, getSongRecommendations } from "@/queries/LaraRecQuerie";
import generateUserVector from "../generateUserVector";

const useLoadRec = (setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const { genres, energy, speechLevel, danceability, tempo, sentiment, voiceType, 
            mood, acousticness } = useAppSelector(state => state.songData);
    const dispatch = useAppDispatch();
    const [getIASongs] = useLazyQuery(getSongRecommendations);
    const [getResponse] = useLazyQuery(getAIResponse);
    const userVector = generateUserVector(tempo, danceability, energy, mood, speechLevel,
        acousticness, voiceType, sentiment);

    const limit = 40;
    
    const loadRecommendations = () => {
        setLoading(true);
        getIASongs({ variables: { genres, userVector, limit }, 
            fetchPolicy: 'no-cache',
            onCompleted: (data) => {
                if (data.getSongRecommendations) {
                    dispatch(setLaraRecommendations(data.getSongRecommendations));
                    navigate("/recommendations");
                    setLoading(false);
                    setOpen(false);
                };
            },
        });

        getResponse({ variables: { genres, userVector },
            fetchPolicy: 'no-cache',
            onCompleted: (data) => {
                if (data.getAIResponse) {
                    dispatch(setMessage(data.getAIResponse))
                }
            }
        })
    };

    return { loadRecommendations, loading }
};

export default useLoadRec;