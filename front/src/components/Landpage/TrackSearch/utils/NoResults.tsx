import { Box, Heading } from "@chakra-ui/react";

const NoResults = () => {
    return(
        <Box display="flex" justifyContent="center" alignItems="center" h="70vh" textAlign="center">
            <Heading>No Data found...</Heading>
        </Box>
    );
};

export default NoResults;