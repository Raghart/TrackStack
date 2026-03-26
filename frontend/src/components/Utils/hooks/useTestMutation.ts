import { testStream } from "@/queries/LaraRecQuerie";
import { useMutation } from "@apollo/client";
import { useEffect } from "react";

const useTestMutation = () => {
    const [streamAnswer, { data }] = useMutation(testStream);
    streamAnswer()
    useEffect(() => {
        console.log(data)
    }, [data])
};

export default useTestMutation;