import { Grid, GridItem, Skeleton } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import NotFound from "../../Error/NotFound";
import AlbumBox from "../AlbumBox/AlbumBox";
import GenreBox from "../GenreBox/GenreBox";
import SongInfoLayout from "./SongInfoLayout";
import useSongDetails from "../../Utils/hooks/useSongDetails";
import { parseDataOrUndefined } from "@/components/Utils/safeParse";
import { positiveIntSchema } from "@trackstack/schemas/zod.parsers";

const SongDetails = () => {
    const { songId } = useParams<{songId: string}>();
    const parsedSongId = parseDataOrUndefined(positiveIntSchema, songId);
    if (!parsedSongId) return <NotFound message="Invalid Song ID" />
    return <FullSongData songId={parsedSongId} />;
};

const FullSongData = ({ songId } : { songId: number }) => {
    const { songData, loading } = useSongDetails(songId);
    const isLoading = loading || !songData;

    if (!loading && !songData) return <NotFound message={
        `The song with the ID: "${songId}" not found in the Database!`} />;

    return(
        <Grid h="73vh" w="full" templateColumns="1fr 1fr" templateRows="1fr 1fr" overflow="visible" pt={5}>
            <GridItem rowSpan={2} display="flex" alignItems="center" justifyContent="center">
                {isLoading ? <Skeleton w="90%" h="full" /> : <SongInfoLayout {...songData} />}
            </GridItem>

            <GridItem h="full" maxH="33vh" pl={1} pr={{ base: 1, sm: 2, md: 2, lg: 3 }}>
                {isLoading ? <Skeleton w="full" h="full" /> : <AlbumBox album_name={songData.album} />}
            </GridItem>

            <GridItem h="full" maxH="35vh" pl={1} pr={{ base: 1, sm: 2, md: 2, lg: 3 }}>
                {isLoading ? <Skeleton w="full" h="full" /> : <GenreBox genres={songData.genres} />}
            </GridItem>
        </Grid>
    );
}

export default SongDetails;