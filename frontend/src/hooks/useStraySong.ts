import { useLazyQuery } from "@apollo/client";
import { useAppDispatch } from "../redux-hooks";
import { setActiveAudio } from "@/reducers/songReducer";
import { getRandomSong } from "@/queries/MusicPlayerQueries";
import { useEffect } from "react";
import { songResponseSchema } from "@trackstack/schemas";
import { parseDataOrUndefined } from "../safeParse";

const useStraySong = () => {
    const dispatch = useAppDispatch();
    const [getStraySong, { data }] = useLazyQuery(getRandomSong, {
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        const parsedData = parseDataOrUndefined(songResponseSchema, data?.getRandomSong);
        if (parsedData) {
            dispatch(setActiveAudio(parsedData));
        }
    }, [data, dispatch])

    return getStraySong;
};

export default useStraySong;