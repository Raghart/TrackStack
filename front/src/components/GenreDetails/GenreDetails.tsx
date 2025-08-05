import SongCard from "@/components/SongCard/SongCard";
import { Flex, SimpleGrid, Skeleton } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import ScrollUpArrow from "@/components/Utils/ScrollUpArrow";
import InfiniteScrollList from "@/components/Pagination/InfiniteScrollList";
import NotFound from "@/components/Error/NotFound";
import { Zoom } from "react-awesome-reveal";
import { SONGCARD_SIZES } from "@/components/constants/SongCardC";
import GenreDetHeader from "./GenreDetHeader";
import { SongResponse } from "@/types/songTypes";
import useGenreSongs from "../Utils/hooks/useGenreSongs";

const GenreDetails = () => {
  const { genre } = useParams();
  const { data, loading, genreKey, loadMore, activeSong, isPlaying, validGenre } = useGenreSongs(genre);

  if (!validGenre || (!loading && !data)) return <NotFound 
    message={`The genre: "${genre}" was not found in the DB!`} />;
  
  return (
    <Flex w="full" h="full" align="center" justify="center" direction="column" pt={8} pb={20} gap={5}
      textAlign="center">
      <Zoom triggerOnce direction="down" delay={100}>
        <GenreDetHeader genre={genreKey} />
      </Zoom>

      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} pt={5} gap={{ base: 3, sm: 3, md: 3, lg: 4 }} w="full">
        {!data && Array.from({ length: 20 }).map((_, idx) => (
          <Skeleton key={idx} w="full" maxW={SONGCARD_SIZES} loading={loading} aspectRatio={3/4} borderRadius="md" />
        ))}

        {data && (
          <InfiniteScrollList<SongResponse> renderItem={(song: SongResponse) => <SongCard key={song.id} {...song} 
            isSongPlaying={isPlaying && song.id === activeSong?.id} /> } items={data.getAllGenreSongs}
            error="There was a problem trying to get the songs of this genre" onLoadMore={loadMore} />
        )}
      </SimpleGrid>
      
      <ScrollUpArrow />
    </Flex>
  );
};

export default GenreDetails;