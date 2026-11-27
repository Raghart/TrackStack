import { Box, Center, For, SimpleGrid, Skeleton } from "@chakra-ui/react";
import ScrollUpArrow from "@/Utils/ScrollUpArrow";
import useGetArtistCards from "@/hooks/useGetArtistCards";
import { Zoom } from "react-awesome-reveal";
import InfiniteScroll from "react-infinite-scroll-component"
import ArtistCard from "./ArtistCard";
import LoadingBeat from "@/Utils/LoadingBeat";
import PathHeader from "@/Utils/PathHeader";
import { PATH_CARD_SIZES } from "../constants/PathC";
import { ArtistResponse } from "@trackstack/schemas";

const ArtistSelection = () => {
    const { data, onLoadMore, hasData } = useGetArtistCards();
    return(
        <Box w="full" h="full" direction="column" pt={8} gap={12} pb={20}>
            <Zoom triggerOnce direction="down" delay={100} style={{ paddingBottom: 40 }}>
                <PathHeader type="Artists" />
            </Zoom>    

            <InfiniteScroll dataLength={data.length} next={onLoadMore} hasMore={true}
                loader={<Center m={2}><LoadingBeat /></Center>} style={{ overflow: "visible" }}>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} w="full" gap={4}>
                    {!hasData && (Array.from({ length: 20 }).map((_, idx) => (
                        <Skeleton key={idx} w="full" maxW={PATH_CARD_SIZES} aspectRatio={3/4} 
                            borderRadius="2xl" inset={0} />
                        ))
                    )}

                    {hasData && (
                        <For each={data}>
                            {(artist: ArtistResponse) => <ArtistCard key={artist.name} {...artist} />}
                        </For>
                    )}
                </SimpleGrid>
            </InfiniteScroll>
            <ScrollUpArrow />
        </Box>
    );
};

export default ArtistSelection;