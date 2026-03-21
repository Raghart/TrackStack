import { Flex, Heading } from "@chakra-ui/react"
import ScrollUpArrow from "@/components/Utils/ScrollUpArrow";
import LoadingResults from "./utils/LoadingResults";
import NoResults from "./utils/NoResults";
import { Zoom } from "react-awesome-reveal";
import { SEARCH_TITLE_FONTSIZES } from "@/components/constants/TrackSearchC";
import SearchResults from "./SearchResults/SearchResults";
import useSearchResponse from "@/components/Utils/hooks/useSearchResponse";

const TrackSearch = () => {
    const { query, isLoading, searchResults } = useSearchResponse();
    return(
        <Flex direction="column" p={4} pb={20}>
            {searchResults && (
                <Zoom triggerOnce direction="left">
                    <Heading fontSize={SEARCH_TITLE_FONTSIZES} userSelect="none" zIndex={1} pb={1} fontWeight="600" 
                    pt={4} 
                        fontFamily="'Barlow Condensed', sans-serif" letterSpacing="wide">
                        Top Results
                    </Heading>
                </Zoom>
            )}

            {isLoading && query.length > 0 && !searchResults && (<LoadingResults />)}
            {!isLoading && query.length > 0 && !searchResults && (<NoResults />)}
            {searchResults && (<SearchResults {...searchResults} />)}
            <ScrollUpArrow />
        </Flex>
    );
};

export default TrackSearch;