import { useLazyQuery } from "@apollo/client";
import { useAppDispatch } from "../redux-hooks";
import { setActiveAudio } from "@/reducers/songReducer";
import { getRandomSong } from "@/queries/MusicPlayerQueries";
import { useEffect } from "react";
import { songResponseSchema } from "@trackstack/schemas";

const useStraySong = () => {
    const dispatch = useAppDispatch();
    const [getStraySong, { data }] = useLazyQuery(getRandomSong, {
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        const result = songResponseSchema.safeParse(data?.getRandomSong);
        if (result.success) {
            dispatch(setActiveAudio(result.data));
        }
    }, [data, dispatch])

    return getStraySong;
};

export default useStraySong;