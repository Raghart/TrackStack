import { testStream } from "@/queries/LaraRecQuerie";
import { useMutation } from "@apollo/client";
import { RefObject, useEffect } from "react";

const useTestMutation = (refSend: RefObject<boolean>) => {
    const [streamAnswer, { data }] = useMutation(testStream);
    useEffect(() => {
        if (!refSend.current) {
            streamAnswer();
            refSend.current = true;
        };
    }, [])
};

export default useTestMutation;