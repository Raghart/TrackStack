import { Box, Center, For, SimpleGrid, Skeleton } from "@chakra-ui/react";
import { Zoom } from "react-awesome-reveal";
import PathHeader from "../Utils/PathHeader";
import InfiniteScroll from "react-infinite-scroll-component";
import useGetAlbumCards from "../Utils/hooks/useGetAlbumCards";
import LoadingBeat from "../Utils/LoadingBeat";
import { AlbumResponse } from "@/types/albumTypes";
import AlbumCard from "./AlbumCard";
import { PATH_CARD_SIZES } from "../constants/ArtistPathC";

const AlbumSelection = () => {
    const { data, onLoadMore } = useGetAlbumCards();
    const dataLength = data?.getAlbums ? data.getAlbums.length : 20;
    return(
        <Box w="full" h="full" direction="column" pt={8} gap={12} pb={20}>
            <Zoom triggerOnce direction="down" delay={100} style={{ paddingBottom: 40 }}>
                <PathHeader type="Albums" />
            </Zoom>
            
            <InfiniteScroll dataLength={dataLength} next={onLoadMore} hasMore={true}
                loader={<Center m={2}><LoadingBeat /></Center>} style={{ overflow: "visible" }}>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} w="full" gap={4}>
                    {!data && (Array.from({ length: 20 }).map((_, idx) => (
                        <Skeleton key={idx} w="full" maxW={PATH_CARD_SIZES} aspectRatio={3/4} 
                            borderRadius="2xl" inset={0} />
                        ))
                    )}

                    {data && (
                        <For each={data.getAlbums}>
                            {(album: AlbumResponse) => (<AlbumCard {...album} />)}
                        </For>
                    )}
                </SimpleGrid>
            </InfiniteScroll>
        </Box>
    )
};

export default AlbumSelection;