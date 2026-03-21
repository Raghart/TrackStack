import { useLazyQuery } from "@apollo/client";
import { useAppDispatch } from "../redux-hooks";
import { setActiveAudio } from "@/reducers/songReducer";
import { getRandomSong } from "@/queries/MusicPlayerQueries";
import { useEffect } from "react";

const useStraySong = () => {
    const dispatch = useAppDispatch();
    const [getStraySong, { data }] = useLazyQuery(getRandomSong, {
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        if (data?.getRandomSong) {
            dispatch(setActiveAudio(data.getRandomSong))
        }
    }, [data, dispatch])

    return getStraySong;
};

export default useStraySong;