import { Flex } from "@chakra-ui/react";
import SongStats from "./SongStats/SongStats";
import LaraRecommendModal from "./LaraRecommendModal/LaraRecommendModal";
import SearchInput from "./SearchInput/SearchInput";
import { TOPBAR_SIZES } from "@/components/constants/TopBarC";
import { useAppSelector } from "@/Utils/redux-hooks";
import useTinyScreen from "@/hooks/useTinyScreen";

const TopBar = () => {
    const isMobileSearch = useAppSelector(state => state.search.isMobileSearch);
    const isTinyScreen = useTinyScreen();
    return(
        <Flex w={TOPBAR_SIZES} maxW="1100px" mr={3} bg="blackAlpha.900" borderRadius="2xl" ml="auto" 
            p={isTinyScreen ? 1 : 2} gap={isTinyScreen ? 2 : 4} boxShadow="0 0 3px gray" zIndex={1} align="center">
            <SearchInput />

            {!isMobileSearch && (
                <Flex ml="auto" gap={isTinyScreen ? 2 : 4}>
                    <LaraRecommendModal />
                    <SongStats />
                </Flex>
            )}
        </Flex>
    );
};

export default TopBar;