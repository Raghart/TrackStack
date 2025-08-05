import { Icon, Input, InputGroup } from "@chakra-ui/react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import useSearchResults from "@/components/Utils/hooks/useSearchResults";

const SearchInput = () => {
    const handleQuery = useSearchResults();
    return (
        <InputGroup startElement={<Icon className="hover-icon" as={HiMiniMagnifyingGlass} color="gray.400" size="lg" 
        transition="all 0.3s ease" />} flex={1} maxW="700px" role="group" _hover={{ "& .hover-icon": { color: "white" } }}
        _focusWithin={{ "& .hover-icon": { color: "white" } }}>
            <Input placeholder="Search a song" aria-label="Search songs by name" border="1px solid"
                borderColor="gray.900" css={{ "--focus-color": "colors.blue.600" }} maxLength={60}
                onChange={({ target }) => handleQuery(target.value)} bg="gray.700" w="100%" 
                maxW={{ base: "100%", md: "700px" }} data-testid="searchInput" />
        </InputGroup>
    );
};

export default SearchInput;