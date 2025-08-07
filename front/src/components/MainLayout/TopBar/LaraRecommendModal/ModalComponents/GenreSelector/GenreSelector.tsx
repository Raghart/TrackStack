import { Box, Flex, Icon, Combobox, HStack, Span } from "@chakra-ui/react";
import { useState } from "react";
import { useAppDispatch } from "@/components/Utils/redux-hooks";
import GenreMoreTag from "./GenreMoreTag";
import GenreTags from "./GenreTags";
import useGenreCollection from "@/components/Utils/hooks/useGenreCollection";
import handleDelLastGenre from "@/components/Utils/handleDelLastGenre";
import handleValueChange from "@/components/Utils/handleValueChanges";
import { BLUE_SHADOW_MODAL, LARA_OPT_SIZES } from "@/components/constants/TopBarC";
import GenreSelHeader from "./GenreSelHeader";
import { GenreListFormat } from "@/types/genreTypes";

const GenreSelector = () => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [isNavigating, setIsNavigating] = useState<boolean>(false);
    const collection = useGenreCollection(searchValue, selectedGenres);
    const dispatch = useAppDispatch();
    return(
        <Box p={5} bg="gray.800" borderRadius="full" border="1px solid" textAlign="center" position="relative"
            borderColor="gray.700" boxShadow="lg" transition="all 0.2s ease-in-out" role="group" w="full" h="120px"
            _hover={{ boxShadow: BLUE_SHADOW_MODAL, transform: "scale(1.02)", borderColor: "blue.400" }} 
            maxW={LARA_OPT_SIZES}>

            {selectedGenres.length > 0 && (
                <Flex wrap="nowrap" gap={2} mb={4} userSelect="none" justify="center">
                    <GenreTags selectedGenres={selectedGenres} />
                    {selectedGenres.length > 3 && (<GenreMoreTag selectedGenres={selectedGenres} /> )}
                </Flex>
            )}

            {selectedGenres.length === 0 && (<GenreSelHeader /> )}

            <Combobox.Root w="full" collection={collection} value={selectedGenres} multiple closeOnSelect 
                onInputValueChange={(details) => setSearchValue(details.inputValue)} aria-label="Select a Music Genre"
                onValueChange={(details) => dispatch(handleValueChange(details, setSelectedGenres, setIsNavigating))} 
                placeholder={selectedGenres.length > 0 ? "Delete by pressing 'Del'" : "Select a Genre"}
                onHighlightChange={(details) => setIsNavigating(details.highlightedValue != null)} variant="outline">
                <Combobox.Control>
                    <Combobox.Input borderRadius="2xl" border="2px solid" borderColor="gray.400" 
                        data-testid="GenreInput" onKeyDown={(e) => dispatch(handleDelLastGenre(e, selectedGenres, 
                        setSelectedGenres, collection, isNavigating))} />
                    <Combobox.IndicatorGroup>
                        <Combobox.ClearTrigger />
                        <Combobox.Trigger />
                    </Combobox.IndicatorGroup>
                </Combobox.Control>

                <Combobox.Positioner>
                    <Combobox.Content maxH="290px" bg="blackAlpha.900">
                        <Combobox.ItemGroup>
                            {collection.items.slice(0,8).map((genre: GenreListFormat) => (
                                <Combobox.Item item={genre} key={genre.name} data-testid="genreFilter">
                                    <HStack gap={3}>
                                        <Icon as={genre.icon} color="teal.500" />
                                        <Span fontFamily="'Barlow', sans-serif" fontWeight="700">{genre.name}</Span>
                                    </HStack>
                                </Combobox.Item>
                            ))}
                            <Combobox.Empty>No genres found</Combobox.Empty>
                        </Combobox.ItemGroup>
                    </Combobox.Content>
                </Combobox.Positioner>
            </Combobox.Root> 
        </Box>
    );
};

export default GenreSelector;