import { useBreakpointValue } from "@chakra-ui/react";
import SearchMobile from "./SearchMobile";
import SearchBar from "./SearchBar";

const SearchInput = () => {
    const isMobile = useBreakpointValue({ base: true, sm: false });
    return (
        <>
            {isMobile ? (<SearchMobile />) : (<SearchBar />)}
        </>
    );
};

export default SearchInput;