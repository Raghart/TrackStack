import { Grid, GridItem, Skeleton } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import NotFound from "../../Error/NotFound";
import AlbumBox from "../AlbumBox/AlbumBox";
import GenreBox from "../GenreBox/GenreBox";
import SongInfoLayout from "./SongInfoLayout";
import useSongDetails from "../../Utils/hooks/useSongDetails";

const SongDetails = () => {
    const { songId } = useParams<{songId: string}>();
    const { songData, loading } = useSongDetails(songId);
    if (!loading && !songData) return <NotFound message={`The song with the ID: "${songId}" not found in the 
    Database!`} />;

    return(
        <Grid h="73vh" w="full" templateColumns="1fr 1fr" templateRows="1fr 1fr" overflow="visible" pt={5}>
            <GridItem rowSpan={2} display="flex" alignItems="center" justifyContent="center">
                {loading ? <Skeleton w="90%" h="full" /> : <SongInfoLayout {...songData} />}
            </GridItem>

            <GridItem h="full" maxH="33vh" pl={1} pr={{ base: 1, sm: 2, md: 2, lg: 3 }}>
                {loading ? <Skeleton w="full" h="full" /> : <AlbumBox album_name={songData.album} />}
            </GridItem>

            <GridItem h="full" maxH="35vh" w="full" pl={1} pr={{ base: 1, sm: 2, md: 2, lg: 3 }}>
                {loading ? <Skeleton w="full" h="full" /> : <GenreBox genres={songData.genres} />}
            </GridItem>
        </Grid>
    );
};

export default SongDetails;