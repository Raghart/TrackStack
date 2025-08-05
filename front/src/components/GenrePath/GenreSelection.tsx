import { Flex, SimpleGrid } from "@chakra-ui/react";
import InfiniteScrollList from "@/components/Pagination/InfiniteScrollList";
import GenreCard from "./GenreCard";
import ScrollUpArrow from "@/components/Utils/ScrollUpArrow";
import GenreSelHeader from "./GenreSelHeader";
import useGenreSel from "../Utils/hooks/useGenreSel";
import { Zoom } from "react-awesome-reveal";
import { GenreListFormat } from "@/types/genreTypes";

const GenreSelection = () => {
    const { visibleGenres, onLoadMore } = useGenreSel();
    return(
        <Flex w="full" h="full" align="center" justify="center" direction="column" gap={12} pt={8} pb={20}>
            <Zoom triggerOnce direction="down" delay={100}>
                <GenreSelHeader />
            </Zoom>

            <Zoom triggerOnce direction="up" delay={100}>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} justifyItems="center" gap={4}>
                    <InfiniteScrollList<GenreListFormat> items={visibleGenres} error="Error with Genre's Pagination" 
                        renderItem={(genre: GenreListFormat) => (<GenreCard key={genre.name} {...genre} />)} 
                        onLoadMore={onLoadMore} />
                </SimpleGrid>
            </Zoom>
            <ScrollUpArrow />
        </Flex>
    );
};

export default GenreSelection;