import { Box, Span } from "@chakra-ui/react";
import CountUp from "react-countup";

const MobileCount = ({ setIsFinished } : { setIsFinished: React.Dispatch<React.SetStateAction<boolean>> }) => {
    return(
        <Box>
            <CountUp end={50} duration={5} onEnd={() => setIsFinished(true)} />
            <Span>K</Span>
        </Box>
    )
};

export default MobileCount;