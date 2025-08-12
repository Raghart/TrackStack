import { useAppDispatch, useAppSelector } from "@/components/Utils/redux-hooks";
import { setIsMobileSeach } from "@/reducers/searchReducer";
import { Box, Icon, IconButton } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import SearchBar from "./SearchBar";

const SearchMobile = () => {
    const dispatch = useAppDispatch();
    const isMobileSearch = useAppSelector(state => state.search.isMobileSearch);
    return(
        <Box>
            {isMobileSearch ? (<SearchBar />) : (
                <IconButton rounded="full" bg="blue.600" size="sm" aria-label="Open search"
                    onClick={() => dispatch(setIsMobileSeach(true))}>
                    <Icon as={LuSearch} color="white" />
                </IconButton>
            )}
        </Box>
    );
};

export default SearchMobile;