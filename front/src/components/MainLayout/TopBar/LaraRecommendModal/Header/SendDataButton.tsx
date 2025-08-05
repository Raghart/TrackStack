import { Button, useBreakpointValue } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners"
import useLoadRec from "@/components/Utils/hooks/useLoadRec";
import { DATA_BTN_FONTSIZES, DATA_BTN_PX, DATA_BTN_SHADOW, DATA_BTN_TRANS } from "@/components/constants/TopBarC";

const SendDataButton = ({ setOpen } : { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { loadRecommendations, loading } = useLoadRec(setOpen);
    const DATA_BTN_LOADER = useBreakpointValue({base: 12, sm: 15, md: 15, lg: 15 });
    return(
        <Button px={DATA_BTN_PX} py={2} fontSize={DATA_BTN_FONTSIZES} loading={loading} border="1px solid"
            bg="rgba(0, 120, 255, 0.1)" fontFamily="'Barlow', sans-serif" fontWeight="700" boxShadow="md"
            borderColor="blue.600" color="blue.200" letterSpacing="wide" borderRadius="xl" backdropFilter="blur(6px)"
            transition={DATA_BTN_TRANS} _hover={{ bg: "blue.500", color: "white", transform: "scale(1.05)", 
            boxShadow: DATA_BTN_SHADOW }} spinner={<BeatLoader size={DATA_BTN_LOADER} color="white" />} 
            onClick={loadRecommendations} data-testid='LaraSendBtn'>
            Send Data
        </Button>
    );
};

export default SendDataButton;