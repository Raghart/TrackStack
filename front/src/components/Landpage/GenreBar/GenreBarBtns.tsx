import { Button, Flex, For, Link } from "@chakra-ui/react";

const GenreBarBtns = ({ genres, handleScroll, scrollRef } : { genres: string[], handleScroll: () => void, 
    scrollRef: React.RefObject<HTMLDivElement | null> }) => {
        
    return(
        <Flex gap={2} ref={scrollRef} overflowX="auto" pt="5px" pl={1} pb={1} w="full" maxW="1095px" overflow="hidden"
            css={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" }, }} onScroll={handleScroll}>

            <Button size="xs" bg="teal.600" color="white" borderRadius="full" border="2px solid" data-testid="allBtn" 
                transform="scale(1.1)" _hover={{ bg: "green.700" }} borderColor="green.800" outline="none"
                fontFamily="'Barlow', sans-serif" fontWeight="600" aria-label="Go to genres page" asChild>
                <Link href="/genres" textDecor="none">
                    All
                </Link>
            </Button>

            <For each={genres}>
                {(genre) => (
                    <Button key={genre} size="xs" bg="teal.600" color="white" borderRadius="full" border="2px solid" 
                    _hover={{ bg: "green.700", transform: "scale(1.1)" }} fontWeight="600" borderColor="green.800" 
                    fontFamily="'Barlow', sans-serif" outline="none" aria-label={`Watch songs with the ${genre} genre`} 
                    asChild>
                        <Link href={`/genres/${genre}`} textDecor="none">{genre}</Link>
                    </Button>
                )}
            </For>
        </Flex>
    );
};

export default GenreBarBtns;