import { SegmentGroup, Heading, Flex } from "@chakra-ui/react";
import { useAppDispatch } from "@/components/Utils/redux-hooks";
import { setSpeechLevel } from "@/reducers/recommendReducer";
import SegmentBtns from "./SegmentBtns";
import { BLUE_SHADOW_MODAL, LARA_OPT_SIZES } from "@/components/constants/TopBarC";

const SegmentOptions = () => {
    const dispatch = useAppDispatch();
    return(
        <Flex p={4} bg="gray.800" borderRadius="full" border="1px solid" borderColor="gray.600" boxShadow="lg" 
            maxW={LARA_OPT_SIZES} transition="all 0.2s ease-in-out" _hover={{ transform: "scale(1.02)", 
            borderColor: "blue.400", boxShadow: BLUE_SHADOW_MODAL }} w="full" h="120px" direction="column" 
            align="center">

            <Heading fontSize="20px" mb={3} textAlign="center" userSelect="none" letterSpacing="wider" fontWeight="700"
                fontFamily="'Barlow Condensed', sans-serif">
                Speech Level
            </Heading>
            
            <SegmentGroup.Root onValueChange={({ value }) => dispatch(setSpeechLevel(value === "Music" ? 0.165 :
                value === "Mixed" ? 0.495 : 0.83))} defaultValue="Music">
                <SegmentGroup.Indicator />
                <SegmentBtns />
            </SegmentGroup.Root>      
        </Flex>
    );
};

export default SegmentOptions;