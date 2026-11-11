import { useAppDispatch } from "../redux-hooks";
import { useQuery } from "@apollo/client";
import { loadAudio } from "@/reducers/songReducer";
import { getSongData } from "@/queries/DetailQueries";
import { fullSongResponseSchema } from "@trackstack/schemas";
import { parseDataOrEmpty } from "../safeParse";

const useSongDetails = (songId: string | undefined) => {
    const dispatch = useAppDispatch();
    const { loading, data } = useQuery(getSongData, { variables: { SongID: Number(songId) }, 
        onCompleted: (data) => {
            if (data && data.getSongData) {
                dispatch(loadAudio(fullSongResponseSchema.parse(data.getSongData)));
            };
        }
    });
    
    const songData = parseDataOrEmpty(fullSongResponseSchema, data?.getSongData);
    return { songData, loading }
};

export default useSongDetails;