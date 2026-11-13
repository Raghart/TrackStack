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
import { getGradientDetails } from "@/dynamicCSS/getGradientDetails";

const DetailsLayout = ({ type } : { type: ValidDetail }) => {
    const { album, artist } = useParams();
    const filterValue = parseDataOrUndefined(stringSchema, album ?? artist);
    if (!isValidDetail(type) || !filterValue) {
        return <NotFound message="Invalid type or search value" />
    }

    return <DetailsData type={type} filterValue={filterValue} />;
};
const DetailsData = ({ type, filterValue } : { type: ValidDetail, filterValue: string }) => {
    const hightlightDetails = getHightlightDetails(type, filterValue);
    const gradientDetails = getGradientDetails(type);
    return (
        <Box direction="column" gap={{ base: 8, sm: 10, md: 11, lg: 11 }} pt={7} textAlign="center" pb={20}>
            <Zoom triggerOnce direction="down" delay={100} style={{ paddingBottom: 40 }}>
                <HighlightTitle title={hightlightDetails.title} 
                    gradientInit={gradientDetails.gradientInit} 
                    grandientMid={gradientDetails.gradientMid} 
                    hightlight={hightlightDetails.hightlight} />
            </Zoom>

            <DetailSongs type={type} filterValue={stringSchema.parse(filterValue)} error={"Not found"} />            
            <ScrollUpArrow />            
        </Box>
    );
};

export default DetailsLayout;