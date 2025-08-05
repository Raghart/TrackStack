import { Flex } from "@chakra-ui/react";
import SongStats from "./SongStats/SongStats";
import LaraRecommendModal from "./LaraRecommendModal/LaraRecommendModal";
import SearchInput from "./SearchInput/SearchInput";
import { TOPBAR_SIZES } from "@/components/constants/TopBarC";

const TopBar = () => {
    return(
        <Flex w={TOPBAR_SIZES} maxW="1100px" mr={3} bg="blackAlpha.900" borderRadius="2xl" p={2} ml="auto" gap={4} 
            boxShadow="0 0 3px gray" zIndex={1}>
            <SearchInput />

            <Flex ml="auto" gap={{ base: 3, sm: 4, md: 5, lg: 5}} mr={2}>
                <LaraRecommendModal />
                <SongStats />
            </Flex>
        </Flex>
    );
};

export default TopBar;