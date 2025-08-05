import { Flex, For, Skeleton } from "@chakra-ui/react";
import React from "react";
import PaginationControl from "@/components/Pagination/PaginationControl";
import LandpageArtistCard from "./LandpageArtCard/LandpageArtistCard";
import ArtistBarHeader from "./ArtistBarHeader";
import useArtistBar from "@/components/Utils/hooks/useArtistBar";
import { Bounce, Zoom } from "react-awesome-reveal";

const ArtistBar = () => {
    const { artists, loading, page, setPage, limit } = useArtistBar();
    return(
        <Flex w="full" h="full" borderRadius="2xl" direction="column" mt={2}>
            {artists.length > 0 && (
                <>
                    <Flex justify="space-between">
                        <Bounce triggerOnce direction="right">
                            <ArtistBarHeader />
                        </Bounce>

                        <Bounce triggerOnce direction="right">
                            <PaginationControl page={page} setPage={setPage} count={100} PageSize={limit || 10} />
                        </Bounce>
                    </Flex>

                    <Zoom triggerOnce direction="left">
                        <Flex align="center" justify="center" gap={2} pb="2.5px">
                            {loading || !artists.length ? Array.from({ length: limit || 10 }).map((_, idx: number) => (
                                <Skeleton key={`skeleton-${idx}`} boxSize="103px" borderRadius="2xl" inset={0} />
                            )) : 
                            <For each={artists}>
                                {(artist) => <LandpageArtistCard key={artist.name} {...artist} /> }
                            </For>}
                        </Flex>
                    </Zoom>
                </>
            )}
        </Flex>
    );
};

export default React.memo(ArtistBar);