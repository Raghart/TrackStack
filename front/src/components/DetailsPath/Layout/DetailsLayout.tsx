import NotFound from "@/components/Error/NotFound";
import { ValidDetail } from "@/types/utilTypes";
import HighlightTitle from "../Utils/HightlightTitle";
import { Box } from "@chakra-ui/react";
import ScrollUpArrow from "@/components/Utils/ScrollUpArrow";
import DetailSongs from "./DetailSongs";
import { isString, isValidDetail } from "@/types/verify";
import useDetailFilter from "@/components/Utils/hooks/useDetailFilter";
import { Zoom } from "react-awesome-reveal";

const DetailsLayout = ({ type, gradientInit, gradientMid, error } : { type: ValidDetail, gradientInit: string, 
    gradientMid: string, error: string }) => {
    const { filterValue, hightlightDetails } = useDetailFilter(type);
    if (!isValidDetail(type) || !isString(filterValue)) return <NotFound message={error} />
    return (
        <Box direction="column" gap={{ base: 8, sm: 10, md: 11, lg: 11 }} pt={7} textAlign="center">
            <Zoom triggerOnce direction="down" delay={100} style={{ paddingBottom: 40 }}>
                <HighlightTitle title={hightlightDetails.title} gradientInit={gradientInit} grandientMid={gradientMid}
                    hightlight={hightlightDetails.hightlight} />
            </Zoom>

            <DetailSongs type={type} filterValue={filterValue} error={error} />            
            <ScrollUpArrow />            
        </Box>
    );
};

export default DetailsLayout;