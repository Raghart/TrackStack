import { Flex, SimpleGrid } from "@chakra-ui/react";
import InfiniteScrollList from "../Pagination/InfiniteScrollList";
import SongCard from "../SongCard/SongCard";
import LaraHeader from "./LaraHeader";
import { Navigate } from "react-router-dom";
import ScrollUpArrow from "../Utils/ScrollUpArrow";
import useSongRec from "../Utils/hooks/useSongRec";
import { useAppSelector } from "../Utils/redux-hooks";
import { Zoom } from "react-awesome-reveal";
import { SongResponse } from "@/types/songTypes";

const LaraRecommendations = () => {
    const { visibleSongs, loadMoreSongs } = useSongRec();
    const { activeSong, isPlaying } = useAppSelector(state => state.songs.songState);
    if (visibleSongs.length === 0) return <Navigate to="/" replace />
    return(
        <Flex direction="column" align="center" justify="center" pt={7} pb={14} gap={7}>
            <Zoom triggerOnce direction="down" delay={100}>
                <LaraHeader />
            </Zoom>

            <Zoom triggerOnce direction="up" delay={100}>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} pt={4} gap={{ base: 3, sm: 3, md: 3, lg: 4 }} 
                    w="full">
                    <InfiniteScrollList renderItem={(song: SongResponse) => <SongCard key={song.id} {...song} 
                        isSongPlaying={isPlaying && activeSong?.id === song.id} />} items={visibleSongs}
                        error="There are no song Recommendations avaible in the DB with the data provided"  
                        onLoadMore={loadMoreSongs} />
                </SimpleGrid>
            </Zoom>
            <ScrollUpArrow />
        </Flex>
    );
};

export default LaraRecommendations;