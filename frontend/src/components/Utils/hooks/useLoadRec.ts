import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux-hooks";
import { DefaultContext, FetchResult, MutationFunctionOptions, OperationVariables, 
    useLazyQuery, useSubscription } from "@apollo/client";
import { cleanMessage, setLaraRecommendations, setMessage } from "@/reducers/recommendReducer";
import { aiSubscription, getSongRecommendations } from "@/queries/LaraRecQuerie";
import generateUserVector from "../generateUserVector";

const useLoadRec = (setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    streamAnswer: (options?: MutationFunctionOptions<OperationVariables, DefaultContext> 
        | undefined) => Promise<FetchResult>
) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { genres, energy, speechLevel, danceability, tempo, sentiment, voiceType, 
            mood, acousticness } = useAppSelector(state => state.songData);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    /*
    useSubscription(aiSubscription, {
        onData({ data }) {
            const chunkText = data.data.aiResponse;
            dispatch(setMessage(chunkText))
        }
    });
    */
    
    const [getIASongs] = useLazyQuery(getSongRecommendations);
    const userVector = generateUserVector(tempo, danceability, energy, mood, speechLevel,
        acousticness, voiceType, sentiment);
    const limit = 40;
    
    const loadRecommendations = async () => {
        setLoading(true);
        //dispatch(cleanMessage())
        const { data } = await getIASongs({ variables: { genres, userVector, limit } });
        
        if (data?.getSongRecommendations) {
            // await streamAnswer({ variables: { genres, userVector } });
            dispatch(setLaraRecommendations(data.getSongRecommendations));
            navigate("/recommendations");
            setLoading(false);
            setOpen(false);
        };
    };

    return { loadRecommendations, loading }
};

export default useLoadRec;