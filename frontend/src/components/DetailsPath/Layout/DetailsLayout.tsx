import NotFound from "@/components/Error/NotFound";
import { ValidDetail } from "@/types/utilTypes";
import HighlightTitle from "../Utils/HightlightTitle";
import { Box } from "@chakra-ui/react";
import ScrollUpArrow from "@/components/Utils/ScrollUpArrow";
import DetailSongs from "./DetailSongs";
import { isValidDetail } from "@/types/verify";
import useDetailFilter from "@/components/Utils/hooks/useDetailFilter";
import { Zoom } from "react-awesome-reveal";
import { stringSchema } from "@trackstack/schemas";

const DetailsLayout = ({ type, gradientInit, gradientMid, error } : { type: ValidDetail, gradientInit: string, 
    gradientMid: string, error: string }) => {
    const { filterValue, hightlightDetails } = useDetailFilter(type);
    if (!isValidDetail(type) || !stringSchema.safeParse(filterValue).success) {
        console.error(`[DetailsLayout] Invalid detail route: type="${String(type)}", filterValue="${String(filterValue)}"`);
        return <NotFound message={error} />
    };
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