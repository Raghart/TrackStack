import { streamAIAnswer } from "@/queries/LaraRecQuerie";
import { useMutation } from "@apollo/client";
import { useEffect } from "react";

const useAIMutation = (genres: string[], userVector: number[]) => {
    const [streamAnswer, { data }] = useMutation(streamAIAnswer);
    streamAnswer({
        variables: { genres, userVector }
    });
    
    useEffect(() => {
        console.log(data)
    },[data])
};

export default useAIMutation;