import { Box } from "@chakra-ui/react"
import LoadingBeat from "../Utils/LoadingBeat"
import Markdown from "react-markdown"

const AIResponse = ({ message } : { message: string }) => {
    return(
        <Box color="white" userSelect="all" fontFamily="'Barlow', sans-serif"
            fontWeight="medium" fontSize={{ lg: "xl" }} fontStyle="italic">
            {!message && (
                <LoadingBeat />
            )}

            {message && (
                <Markdown skipHtml>{message}</Markdown>
            )}
        </Box>
    );
};

export default AIResponse;