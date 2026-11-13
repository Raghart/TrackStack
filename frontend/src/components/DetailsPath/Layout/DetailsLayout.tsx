import NotFound from "@/components/Error/NotFound";
import { ValidDetail } from "@/types/utilTypes";
import HighlightTitle from "../Utils/HightlightTitle";
import { Box } from "@chakra-ui/react";
import ScrollUpArrow from "@/components/Utils/ScrollUpArrow";
import DetailSongs from "./DetailSongs";
import { isValidDetail } from "@/types/verify";
import { Zoom } from "react-awesome-reveal";
import { stringSchema } from "@trackstack/schemas/zod.parsers";
import { useParams } from "react-router-dom";
import getHightlightDetails from "@/dynamicCSS/getHighlightDetails";
import { parseDataOrUndefined } from "@/components/Utils/safeParse";

const DetailsLayout = ({ type, gradientInit, gradientMid, error } : { type: ValidDetail, gradientInit: string, 
    gradientMid: string, error: string }) => {
    const { album, artist } = useParams();
    const filterValue = parseDataOrUndefined(stringSchema, album ?? artist);
    if (!isValidDetail(type) || !filterValue) {
        return <NotFound message="Invalid type or search value" />
    }
    const hightlightDetails = getHightlightDetails(type, filterValue);
    return (
        <Box direction="column" gap={{ base: 8, sm: 10, md: 11, lg: 11 }} pt={7} textAlign="center" pb={20}>
            <Zoom triggerOnce direction="down" delay={100} style={{ paddingBottom: 40 }}>
                <HighlightTitle title={hightlightDetails.title} gradientInit={gradientInit} grandientMid={gradientMid}
                    hightlight={hightlightDetails.hightlight} />
            </Zoom>

            <DetailSongs type={type} filterValue={stringSchema.parse(filterValue)} error={error} />            
            <ScrollUpArrow />            
        </Box>
    );
};

const DetailsData = ({ type, filterValue, gradientInit, gradientMid, error } : { type: ValidDetail, 
    filterValue: string, gradientInit: string, radientInit: string, gradientMid: string, error: string }) => {
    const hightlightDetails = getHightlightDetails(type, filterValue);
    return (
        <Box direction="column" gap={{ base: 8, sm: 10, md: 11, lg: 11 }} pt={7} textAlign="center" pb={20}>
            <Zoom triggerOnce direction="down" delay={100} style={{ paddingBottom: 40 }}>
                <HighlightTitle title={hightlightDetails.title} gradientInit={gradientInit} grandientMid={gradientMid}
                    hightlight={hightlightDetails.hightlight} />
            </Zoom>

            <DetailSongs type={type} filterValue={stringSchema.parse(filterValue)} error={error} />            
            <ScrollUpArrow />            
        </Box>
    );
};

export default DetailsLayout;