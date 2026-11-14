import { Box, Heading, Text } from "@chakra-ui/react";
import { SearchFailureStatus } from "@/types/searchTypes";
import { getSearchErrorMessage } from "@/components/Utils/searchErrorMessages";

const SearchError = ({ status }: { status: SearchFailureStatus }) => {
    const { title, description } = getSearchErrorMessage(status);

    return (
        <Box data-testid={`search-error-${status}`} display="flex" flexDirection="column"
            justifyContent="center" alignItems="center" gap={3} h="70vh" textAlign="center" px={4}>
            <Heading>{title}</Heading>
            <Text color="whiteAlpha.800">{description}</Text>
        </Box>
    );
};

export default SearchError;
