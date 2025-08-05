import { Box, Button, Flex, For, Link } from "@chakra-ui/react";

const GenreBarBtns = ({ genres, scrollRef, leftSentinel, rightSentinel } : { genres: string[],
    scrollRef: React.RefObject<HTMLDivElement | null>, leftSentinel: React.RefObject<HTMLDivElement | null>,
    rightSentinel: React.RefObject<HTMLDivElement | null>
    }) => {
        
    return(
        <Flex gap={2} ref={scrollRef} overflowX="auto" pt="5px" pl={1} pb={1} w="full" maxW="1095px" overflow="hidden"
            css={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" }, }}>

            <Box ref={leftSentinel}>
                <Button size="xs" bg="teal.600" color="white" borderRadius="full" border="2px solid" 
                    transform="scale(1.1)" _hover={{ bg: "green.700" }} borderColor="green.800" 
                    fontFamily="'Barlow', sans-serif" fontWeight="600" outline="none" asChild
                    data-testid="allBtn">
                    <Link href="/genres" textDecor="none">
                        All
                    </Link>
                </Button>
            </Box>

            <For each={genres}>
                {(genre) => (
                    <Button key={genre} size="xs" bg="teal.600" color="white" borderRadius="full" border="2px solid" 
                        _hover={{ bg: "green.700", transform: "scale(1.1)" }} fontWeight="600" borderColor="green.800" 
                        fontFamily="'Barlow', sans-serif" outline="none" asChild>
                        <Link href={`/genres/${genre}`} textDecor="none">{genre}</Link>
                    </Button>
                )}
            </For>
            <Box ref={rightSentinel} boxSize="1px" />
        </Flex>
    );
};

export default GenreBarBtns;