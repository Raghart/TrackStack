import { TITLE_DETAILS_FONTSIZE, TITLE_DETAILS_HIGHT_FONTSIZE } from "@/components/constants/DetailsLayoutC";
import { Heading, Highlight } from "@chakra-ui/react";

const HighlightTitle = ({ title, hightlight, gradientInit, grandientMid }: { title: string, hightlight: string, 
    gradientInit: string, grandientMid: string }) => {
    return(
        <Heading fontSize={TITLE_DETAILS_FONTSIZE} userSelect="none" letterSpacing="wider" lineHeight={1} 
            w="100%" maxW="full" lineClamp={2} overflow={hightlight.length < 20 ? "visible" : "hidden"}
            fontFamily="'Barlow Condensed', sans-serif" fontWeight="600">
            <Highlight query={hightlight} styles={{ bgGradient: "to-br", bgClip: "text", gradientFrom: gradientInit, 
                gradientVia: grandientMid, gradientTo: gradientInit, fontSize: TITLE_DETAILS_HIGHT_FONTSIZE, 
                fontWeight: "800", whiteSpace: "normal", overflowWrap: "break-word", wordBreak: "break-word" }}>
                {title}
            </Highlight>
        </Heading>
    );
};

export default HighlightTitle;