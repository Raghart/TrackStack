import { useLazyQuery } from "@apollo/client";
import { useAppDispatch } from "../redux-hooks";
import { setActiveAudio } from "@/reducers/songReducer";
import { getRandomSong } from "@/queries/MusicPlayerQueries";

const useStraySong = () => {
    const dispatch = useAppDispatch();
    const [getStraySong] = useLazyQuery(getRandomSong, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            if (data.getRandomSong) {
                dispatch(setActiveAudio(data.getRandomSong));
            };
        }
    });

    return getStraySong;
};

export default useStraySong;