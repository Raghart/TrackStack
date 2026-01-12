import { Box, Center, For, SimpleGrid, Skeleton } from "@chakra-ui/react";
import ScrollUpArrow from "@/components/Utils/ScrollUpArrow";
import ArtistHeader from "./ArtistHeader";
import useGetArtistCards from "../Utils/hooks/useGetArtistCards";
import { Zoom } from "react-awesome-reveal";
import { ARTIST_CARD_SIZES } from "../constants/ArtistPathC";
import InfiniteScroll from "react-infinite-scroll-component"
import { ArtistResponse } from "@/types/artistTypes";
import ArtistCard from "./ArtistCard";
import LoadingBeat from "../Utils/LoadingBeat";

const ArtistSelection = () => {
    const { data, onLoadMore } = useGetArtistCards();
    const dataLength = data?.getAllArtists ? data.getAllArtists.length : 20;

    return(
        <Box w="full" h="full" direction="column" pt={8} gap={12}>
            <Zoom triggerOnce direction="down" delay={100} style={{ paddingBottom: 40 }}>
                <ArtistHeader />
            </Zoom>    

            <InfiniteScroll dataLength={dataLength} next={onLoadMore} hasMore={true}
                loader={<Center m={2}><LoadingBeat /></Center>} style={{ overflow: "visible" }}>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} w="full" gap={4}>
                    {!data && (Array.from({ length: 20 }).map((_, idx) => (
                        <Skeleton key={idx} w="full" maxW={ARTIST_CARD_SIZES} aspectRatio={3/4} 
                            borderRadius="2xl" inset={0} />
                        ))
                    )}

                    {data && (
                        <For each={data.getAllArtists}>
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