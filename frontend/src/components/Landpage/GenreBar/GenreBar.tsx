import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import GenreBarHeader from "./GenreBarHeader";
import useGenreBtns from "@/components/Utils/hooks/useGenreBtns";
import GenrePagination from "./GenrePagination";
import GenreBarBtns from "./GenreBarBtns";
import { Bounce } from "react-awesome-reveal";

const GenreBar = () => {
    const { genres, hasData, atStart, atEnd, scrollRef, handleScroll } = useGenreBtns();
    return(
        <Flex w="full" h="full" borderRadius="2xl" direction="column" mt={2}>
            {hasData ? (
                <>
                    <Flex justify="space-between">
                        <Bounce triggerOnce direction="right">
                            <GenreBarHeader />
                        </Bounce>

                        <Bounce triggerOnce direction="right">
                            <GenrePagination scrollRef={scrollRef} atStart={atStart} atEnd={atEnd} />
                        </Bounce>
                    </Flex>

                    <Bounce triggerOnce delay={300} direction="left">
                        <GenreBarBtns genres={genres} handleScroll={handleScroll} scrollRef={scrollRef} />
                    </Bounce>
                </>
            ) : (
                <Box h="73px" />
            )}
        </Flex>
    );
};

export default React.memo(GenreBar);