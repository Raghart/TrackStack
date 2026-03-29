import useSearchResults from "@/components/Utils/hooks/useSearchResults";
import { Icon, Input, InputGroup } from "@chakra-ui/react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import CloseSearchBtn from "./closeSearchBtn";

const SearchBar = () => {
    const { localQuery, handleQueryChange, clearSearch } = useSearchResults();
    return(
        <InputGroup startElement={<Icon className="hover-icon" as={HiMiniMagnifyingGlass} color="gray.400" 
            size="lg" transition="color 0.3s ease" />} flex={1} _hover={{ "& .hover-icon": { color: "white" } }} 
            _focusWithin={{ "& .hover-icon": { color: "white" } }} maxW="700px" role="group"
            endElement={localQuery ? (<CloseSearchBtn clearSearch={clearSearch} />) : undefined}>
            <Input placeholder="Search a song" aria-label="Search songs by name" border="1px solid" autoFocus
                borderColor="gray.900" css={{ "--focus-color": "colors.blue.600" }} maxLength={60}
                onChange={({ target }) => handleQueryChange(target.value)} bg="gray.700" w="100%"
                data-testid="searchInput" maxW={{ base: "100%", md: "700px" }} value={localQuery} />
        </InputGroup>
    );
};

export default SearchBar;