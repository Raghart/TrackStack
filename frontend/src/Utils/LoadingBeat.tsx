import { Flex } from "@chakra-ui/react"
import { BeatLoader } from "react-spinners"

const LoadingBeat = ({ size = 20 } : { size?: number }) => {
    return(
        <Flex>
            <BeatLoader size={size} color=" white" />
        </Flex>
    );
};

export default LoadingBeat;