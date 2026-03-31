import { Box, Center } from "@chakra-ui/react"
import LoadingBeat from "../Utils/LoadingBeat"
import Markdown from "react-markdown"

const AIResponse = ({ message } : { message: string }) => {
    return(
        <Box color="white" userSelect="none" fontFamily="'Barlow', sans-serif" fontWeight="medium" 
            fontSize={{ base: "md", sm: "lg", md: "xl", lg: "xl" }} fontStyle="italic" alignItems="center">
            {message ? (<Markdown skipHtml>{message}</Markdown>) : (
                <Center>
                    <LoadingBeat />
                </Center>
            )}
        </Box>
    );
};

export default AIResponse;