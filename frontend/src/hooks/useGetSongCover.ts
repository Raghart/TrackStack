import { getSongData } from "@/queries/DetailQueries";
import { useLazyQuery } from "@apollo/client";
import { fullSongResponseSchema } from "@trackstack/schemas";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { parseDataOrUndefined } from "../safeParse";
import { positiveIntSchema } from "@trackstack/schemas/zod.parsers";
import { toaster } from "@/components/ui/toasterInstance";

const useGetSongCover = () => {
    const { songId } = useParams();
    const [getSongID, { data }] = useLazyQuery(getSongData);

    useEffect(() => {
        const result = positiveIntSchema.safeParse(songId);
        if (!result.success) return;

        let cancelled = false;

        const fetchCover = async () => {
            try {
                const response = await getSongID({ variables: { SongID: result.data } });
                if (response?.error) throw response.error;
            } catch (error) {
                if (cancelled) return;
                console.error("Unable to get the song cover", error);
                toaster.create({
                    type: "error",
                    title: "Cover unavailable",
                    description: "We couldn't load the song cover. Please try again.",
                    meta: { closable: true },
                });
            }
        };

        void fetchCover();

        return () => {
            cancelled = true;
        };
    }, [songId, getSongID]);
    return parseDataOrUndefined(fullSongResponseSchema, data?.getSongData);
};

export default useGetSongCover;