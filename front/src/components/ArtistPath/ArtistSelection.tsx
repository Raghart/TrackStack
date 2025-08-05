import InfiniteScrollList from "@/components/Pagination/InfiniteScrollList";
import { Flex, SimpleGrid, Skeleton } from "@chakra-ui/react";
import ScrollUpArrow from "@/components/Utils/ScrollUpArrow";
import ArtistCard from "./ArtistCard";
import ArtistHeader from "./ArtistHeader";
import useGetArtistCards from "../Utils/hooks/useGetArtistCards";
import { Zoom } from "react-awesome-reveal";
import { ARTIST_CARD_SIZES } from "../constants/ArtistPathC";
import { ArtistResponse } from "@/types/artistTypes";

const ArtistSelection = () => {
    const { data, onLoadMore } = useGetArtistCards();
    return(
        <Flex w="full" h="full" direction="column" justify="center" align="center" pt={8} gap={12} pb={20}>
            <Zoom triggerOnce direction="down" delay={100}>
                <ArtistHeader />
            </Zoom>

            <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} w="full" gap={4}>
                {!data && (Array.from({ length: 20 }).map((_, idx) => (
                    <Skeleton key={idx} w="full" maxW={ARTIST_CARD_SIZES} aspectRatio={3/4} borderRadius="2xl" />
                )))}
                
                {data && (
                    <InfiniteScrollList<ArtistResponse> items={data.getAllArtists} onLoadMore={onLoadMore}
                        error="Error Trying to get the artists" renderItem={(artist: ArtistResponse) => (
                            <ArtistCard key={artist.name} {...artist} />
                    )} />
                )}
            </SimpleGrid>
            <ScrollUpArrow />
        </Flex>
    );
};

export default ArtistSelection;