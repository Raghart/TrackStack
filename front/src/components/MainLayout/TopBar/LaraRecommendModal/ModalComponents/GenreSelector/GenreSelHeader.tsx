import { Flex, Heading, Icon } from "@chakra-ui/react";
import { FaMagic } from "react-icons/fa";

const GenreSelHeader = () => {
    return(
        <Flex align="center" justify="center" mb={4} gap={2} userSelect="none">
            <Icon as={FaMagic} color="green.400" boxSize={5} />
            <Heading size="md" color="gray.100" letterSpacing="wider" fontSize="20px" fontWeight="700"
                fontFamily="'Barlow Condensed', sans-serif">
                Filter by Genre
            </Heading>
        </Flex>
    );
};

export default GenreSelHeader;