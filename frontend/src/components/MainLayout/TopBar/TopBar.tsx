import { Flex } from "@chakra-ui/react";
import SongStats from "./SongStats/SongStats";
import LaraRecommendModal from "./LaraRecommendModal/LaraRecommendModal";
import SearchInput from "./SearchInput/SearchInput";
import { TOPBAR_SIZES } from "@/components/constants/TopBarC";
import { useAppSelector } from "@/components/Utils/redux-hooks";

const TopBar = () => {
    const isMobileSearch = useAppSelector(state => state.search.isMobileSearch);
    return(
        <Flex w={TOPBAR_SIZES} maxW="1100px" mr={3} bg="blackAlpha.900" borderRadius="2xl" p={2} ml="auto" gap={4} 
            boxShadow="0 0 3px gray" zIndex={1} align="center">
            <SearchInput />

            {!isMobileSearch && (
                <Flex ml="auto" gap={4}>
                    <LaraRecommendModal />
                    <SongStats />
                </Flex>
            )}
        </Flex>
    );
};

export default TopBar;