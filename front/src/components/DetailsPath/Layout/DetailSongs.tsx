import { Center, For, SimpleGrid, Skeleton } from "@chakra-ui/react";
import SongCard from "../../SongCard/SongCard";
import { ValidDetail } from "@/types/utilTypes";
import NotFound from "@/components/Error/NotFound";
import { useAppSelector } from "@/components/Utils/redux-hooks";
import useGetDetailSongs from "@/components/Utils/hooks/useGetDetailSongs";
import { SONGCARD_SIZES } from "@/components/constants/SongCardC";
import { SongResponse } from "@/types/songTypes";
import InfiniteScroll from "react-infinite-scroll-component";
import PaginateSongs from "@/components/Pagination/PaginateSongs";
import LoadingBeat from "@/components/Utils/LoadingBeat";

const DetailSongs = ({ type, filterValue, error }: { type: ValidDetail, filterValue: string, error: string }) => {
    const { data, loading, detailSongs } = useGetDetailSongs(type, filterValue);
    const { visibleSongs, loadMoreSongs } = PaginateSongs(detailSongs);
    const { activeSong, isPlaying } = useAppSelector(state => state.songs.songState);
    if (!loading && !data && detailSongs.length === 0) return <NotFound message={error} />

    return(
        <InfiniteScroll dataLength={visibleSongs.length} hasMore={visibleSongs.length < detailSongs.length} 
            loader={<Center m={2}><LoadingBeat /></Center>} next={loadMoreSongs} 
            style={{ display: "block", paddingBottom: 80 }}>
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} gap={{ base: 3, sm: 3, md: 3, lg: 4 }} 
                w="full">
                {!data && (Array.from({ length: 20 }).map((_, idx) => <Skeleton key={idx} w="full" 
                    maxW={SONGCARD_SIZES} loading={loading} aspectRatio={3/4} borderRadius="md" />))}
                
                {data && (
                    <For each={visibleSongs}>
                        {(song: SongResponse) => <SongCard key={song.id} {...song} 
                            isSongPlaying={isPlaying && activeSong?.id === song.id} />}
                    </For>
                )}   
            </SimpleGrid>
        </InfiniteScroll>
    );
};

export default DetailSongs;