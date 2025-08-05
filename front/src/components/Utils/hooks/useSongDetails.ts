import { useAppDispatch } from "../redux-hooks";
import { useQuery } from "@apollo/client";
import { loadAudio } from "@/reducers/songReducer";
import { getSongData } from "@/queries/DetailQueries";
import { FullSongResponse } from "@/types/songTypes";

const useSongDetails = (songId: string | undefined) => {
    const dispatch = useAppDispatch();
    const { loading, data } = useQuery(getSongData, { variables: { SongID: Number(songId) }, 
        onCompleted: (data) => {
            if (data && data.getSongData) {
                dispatch(loadAudio(data.getSongData));
            };
        }
    });
    const songData: FullSongResponse = data?.getSongData || null;

    return { songData, loading }
};

export default useSongDetails;