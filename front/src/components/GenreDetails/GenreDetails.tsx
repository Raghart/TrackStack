import SongCard from "@/components/SongCard/SongCard";
import { Box, Center, For, SimpleGrid, Skeleton } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import ScrollUpArrow from "@/components/Utils/ScrollUpArrow";
import NotFound from "@/components/Error/NotFound";
import { Zoom } from "react-awesome-reveal";
import { SONGCARD_SIZES } from "@/components/constants/SongCardC";
import GenreDetHeader from "./GenreDetHeader";
import { SongResponse } from "@/types/songTypes";
import useGenreSongs from "../Utils/hooks/useGenreSongs";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingBeat from "../Utils/LoadingBeat";

const GenreDetails = () => {
  const { genre } = useParams();
  const { data, loading, genreKey, loadMore, activeSong, isPlaying, validGenre } = useGenreSongs(genre);
  const dataLength = data?.getAllGenreSongs ? data.getAllGenreSongs.length : 20;

  if (!validGenre || (!loading && !data)) return <NotFound 
    message={`The genre: "${genre}" was not found in the DB!`} />;
  
  return (
    <Box w="full" h="full" direction="column" pt={8} gap={5} textAlign="center">
      <Zoom triggerOnce direction="down" delay={100} style={{ paddingBottom: 40 }}>
        <GenreDetHeader genre={genreKey} />
      </Zoom>

      <InfiniteScroll dataLength={dataLength} next={loadMore} hasMore={true} 
        loader={<Center m={2}><LoadingBeat /></Center>} style={{ display: "block" }}>
          <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} pt={5} gap={{ base: 3, sm: 3, md: 3, 
            lg: 4 }} w="full">
          {!data && (Array.from({ length: 20 }).map((_, idx) => (
            <Skeleton key={idx} w="full" maxW={SONGCARD_SIZES} loading={loading} aspectRatio={3/4} 
              borderRadius="md" />
          )))}
          
          {data && (
            <For each={data.getAllGenreSongs}>
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