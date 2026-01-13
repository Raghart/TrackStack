import { Box, Center, For, SimpleGrid } from "@chakra-ui/react";
import GenreCard from "./GenreCard";
import ScrollUpArrow from "@/components/Utils/ScrollUpArrow";
import GenreSelHeader from "./GenreSelHeader";
import useGenreSel from "../Utils/hooks/useGenreSel";
import { Zoom } from "react-awesome-reveal";
import { GenreListFormat } from "@/types/genreTypes";
import InfiniteScroll from "react-infinite-scroll-component";
import { genreList } from "../Utils/genreIconList";
import LoadingBeat from "../Utils/LoadingBeat";

const GenreSelection = () => {
    const { visibleGenres, loadMoreGenres } = useGenreSel();
    return(
        <Box w="full" h="full" direction="column" gap={12} pt={8} pb={20}>
            <Zoom triggerOnce direction="down" delay={100} style={{ paddingBottom: 30 }}>
                <GenreSelHeader />
            </Zoom>

            <Zoom triggerOnce direction="up" delay={100}>
                <InfiniteScroll next={loadMoreGenres} hasMore={visibleGenres.length < genreList.length} 
                    loader={<Center m={2}><LoadingBeat /></Center>} dataLength={visibleGenres.length}
                    style={{ overflow: "visible" }}>
                    <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} justifyItems="center" gap={4}>
                        <For each={visibleGenres}>
                            {(genre: GenreListFormat) => <GenreCard key={genre.name} {...genre} />}
                        </For>
                    </SimpleGrid>
                </InfiniteScroll>
            </Zoom>
            <ScrollUpArrow />
        </Box>
    );
};

export default GenreSelection;