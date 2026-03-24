import { Box, Text } from "@chakra-ui/react"
import LoadingBeat from "../Utils/LoadingBeat"

const ResponseBox = ({ aiResponse } : { aiResponse: string }) => {
    return(
        <Box>
            {!aiResponse && (
                <LoadingBeat />
            )}

            {aiResponse && (
                <Text color="white" userSelect="none" fontFamily="'Barlow Condensed', sans-serif">
                    {aiResponse }
                </Text>
            )}
        </Box>
    );
};

export default ResponseBox;