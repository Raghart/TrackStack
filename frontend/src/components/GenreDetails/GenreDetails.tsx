import SongCard from "@/components/SongCard/SongCard";
import { Box, Center, For, SimpleGrid, Skeleton } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import ScrollUpArrow from "@/components/Utils/ScrollUpArrow";
import NotFound from "@/components/Error/NotFound";
import { Zoom } from "react-awesome-reveal";
import { SONGCARD_SIZES } from "@/components/constants/SongCardC";
import GenreDetHeader from "./GenreDetHeader";
import useGenreSongs from "../Utils/hooks/useGenreSongs";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingBeat from "../Utils/LoadingBeat";
import { SongResponse } from "@trackstack/schemas";
import { isValidGenre } from "@/types/verify";

const GenreDetails = () => {
  const { genre } = useParams();
  if (!isValidGenre(genre)) return <NotFound message={`404: Invalid Genre!`} />;
  const { data, loading, loadMore, activeSong, isPlaying, hasData } = useGenreSongs(genre);
  if ( !loading && !data) return <NotFound message={`Error while retrieving the "${genre}" songs`} />;
  
  return (
    <Box w="full" h="full" direction="column" pt={8} gap={5} textAlign="center" pb={20}>
      <Zoom triggerOnce direction="down" delay={100} style={{ paddingBottom: 40 }}>
        <GenreDetHeader genre={genre} />
      </Zoom>

      <InfiniteScroll dataLength={data.length} next={loadMore} hasMore={true} 
        loader={<Center m={2}><LoadingBeat /></Center>} style={{ overflow: "visible" }}>
          <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} pt={5} gap={{ base: 3, sm: 3, md: 3, 
            lg: 4 }} w="full">
          {!hasData && (Array.from({ length: 20 }).map((_, idx) => (
            <Skeleton key={idx} w="full" maxW={SONGCARD_SIZES} loading={loading} aspectRatio={3/4} 
              borderRadius="md" />
          )))}
          
          {hasData && (
            <For each={data}>
              {(song: SongResponse) => <SongCard key={song.id} {...song} 
                isSongPlaying={isPlaying && song.id === activeSong?.id} />}
            </For>
          )}
        </SimpleGrid>
      </InfiniteScroll>
      <ScrollUpArrow />
    </Box>
  );
};

export default GenreDetails;