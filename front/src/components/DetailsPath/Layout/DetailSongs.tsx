import { SimpleGrid, Skeleton } from "@chakra-ui/react";
import InfiniteScrollList from "@/components/Pagination/InfiniteScrollList";
import SongCard from "../../SongCard/SongCard";
import { ValidDetail } from "@/types/utilTypes";
import NotFound from "@/components/Error/NotFound";
import { useAppSelector } from "@/components/Utils/redux-hooks";
import useGetDetailSongs from "@/components/Utils/hooks/useGetDetailSongs";
import { SONGCARD_SIZES } from "@/components/constants/SongCardC";
import { SongResponse } from "@/types/songTypes";

const DetailSongs = ({ type, filterValue, error }: { type: ValidDetail, filterValue: string, error: string }) => {
    const { data, loading, visibleSongs, onLoadMore } = useGetDetailSongs(type, filterValue);
    const { activeSong, isPlaying } = useAppSelector(state => state.songs.songState);
    if (!loading && !data && visibleSongs.length === 0) return <NotFound message={error} />

    return(
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} gap={{ base: 3, sm: 3, md: 3, lg: 4 }} w="full">
            {data ? (
                <InfiniteScrollList renderItem={(song: SongResponse) => <SongCard key={song.id} {...song} 
                    isSongPlaying={isPlaying && activeSong?.id === song.id} />} onLoadMore={onLoadMore}
                    error={`There was an error while Trying to manage the received data!`} items={visibleSongs} />
            ) : (
                Array.from({ length: 20 }).map((_, idx) => (
                <Skeleton key={idx} w="full" maxW={SONGCARD_SIZES} aspectRatio={3/4} borderRadius="md" />
            )))}   
        </SimpleGrid>
    );
};

export default DetailSongs;