import { Box, Center, Text } from "@chakra-ui/react"
import type { ApolloError } from "@apollo/client"
import LoadingBeat from "../Utils/LoadingBeat"
import Markdown from "react-markdown"

const AIResponse = ({ message, error } : { message: string, error: ApolloError | null }) => {
    return(
        <Box color="white" userSelect="none" fontFamily="'Barlow', sans-serif" fontWeight="medium" 
            fontSize={{ base: "md", sm: "lg", md: "xl", lg: "xl" }} fontStyle="italic" alignItems="center">
            {error ? (
                <Text role="alert" color="red.300">
                    We couldn't load Lara's recommendations right now. Please try again later.
                </Text>
            ) : message ? (<Markdown skipHtml>{message}</Markdown>) : (
                <Center>
                    <LoadingBeat />
                </Center>
            )}
        </Box>
    );
};

export default AIResponse;
