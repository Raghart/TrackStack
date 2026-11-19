import { useLazyQuery } from "@apollo/client";
import { setActiveAudio } from "@/reducers/songReducer";
import { getRandomSong } from "@/queries/MusicPlayerQueries";
import { useEffect } from "react";
import { songResponseSchema } from "@trackstack/schemas";
import { useAppDispatch } from "@/Utils/redux-hooks";
import { parseDataOrUndefined } from "@/Utils/safeParse";

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