import { Box, Center, For, SimpleGrid } from "@chakra-ui/react";
import SongCard from "../SongCard/SongCard";
import LaraHeader from "./LaraHeader";
import { Navigate } from "react-router-dom";
import ScrollUpArrow from "../Utils/ScrollUpArrow";
import useSongRec from "../Utils/hooks/useSongRec";
import { useAppSelector } from "../Utils/redux-hooks";
import { Zoom } from "react-awesome-reveal";
import { SongResponse } from "@/types/songTypes";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingBeat from "../Utils/LoadingBeat";

const LaraRecommendations = () => {
    const { visibleSongs, recommendations, loadMoreSongs } = useSongRec();
    const { activeSong, isPlaying } = useAppSelector(state => state.songs.songState);
    if (visibleSongs.length === 0) return <Navigate to="/" replace />
    
    return(
        <Box direction="column" pt={7} pb={24} gap={7}>
            <Zoom triggerOnce direction="down" delay={100} style={{ paddingBottom: 20 }}>
                <LaraHeader />
            </Zoom>

            <Zoom triggerOnce direction="up" delay={100}>
                <InfiniteScroll hasMore={visibleSongs.length < recommendations.length} next={loadMoreSongs}
                    dataLength={visibleSongs.length} loader={<Center m={2}><LoadingBeat /></Center>}
                    style={{ overflow: "visible" }}>
                    <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} pt={4} w="full" 
                        gap={{ base: 3, sm: 3, md: 3, lg: 4 }}>
                        <For each={visibleSongs}>
                            {(song: SongResponse) => <SongCard key={song.id} {...song} 
                                isSongPlaying={isPlaying && activeSong?.id === song.id} />}
                        </For>
                    </SimpleGrid>
                </InfiniteScroll>
            </Zoom>
            <ScrollUpArrow />
        </Box>
    );
};

export default LaraRecommendations;