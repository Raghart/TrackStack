import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux-hooks";
import { ApolloCache, DefaultContext, FetchResult, MutationFunctionOptions, OperationVariables, 
    useLazyQuery, useSubscription } from "@apollo/client";
import { cleanMessage, setLaraRecommendations, setMessage } from "@/reducers/recommendReducer";
import { aiSubscription, getSongRecommendations, testStream } from "@/queries/LaraRecQuerie";
import generateUserVector from "../generateUserVector";

const useLoadRec = (setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    streamAnswer: (options?: MutationFunctionOptions<any, OperationVariables, DefaultContext, 
        ApolloCache<any>> | undefined) => Promise<FetchResult<any>>
) => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    useSubscription(aiSubscription, {
        onData({ data }) {
            const chunkText = data.data.aiResponse;
            dispatch(setMessage(chunkText))
        }
    });
    
    const { genres, energy, speechLevel, danceability, tempo, sentiment, voiceType, 
            mood, acousticness } = useAppSelector(state => state.songData);
    const dispatch = useAppDispatch();
    const [getIASongs] = useLazyQuery(getSongRecommendations);
    const userVector = generateUserVector(tempo, danceability, energy, mood, speechLevel,
        acousticness, voiceType, sentiment);

    const limit = 40;
    
    const loadRecommendations = () => {
        setLoading(true);
        dispatch(cleanMessage())
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
        streamAnswer({
            variables: { genres, userVector }
        });
    };

    return { loadRecommendations, loading }
};

export default useLoadRec;