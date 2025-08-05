import { HOMEBAR_TITLE_FONTSIZE } from "@/components/constants/HomeBarC";
import { Flex, Heading, Icon } from "@chakra-ui/react";
import { MdLibraryMusic } from "react-icons/md";

const HeadingTitle = () => {
    return(
        <Flex align="center" justify="center" gap={2} _hover={{ transform: "scale(1.1)" }} mb={6} userSelect="none" 
            transition="transform 0.2s ease">
            <Icon as={MdLibraryMusic} color="blue.500" size={{ base: "sm", sm: "md",  md: "md", lg: "lg"}} />
            <Heading fontSize={HOMEBAR_TITLE_FONTSIZE} letterSpacing="wide" fontFamily="'Barlow Condensed', sans-serif" 
                fontWeight="600">
                TrackStack
            </Heading>
        </Flex>
    );
};

export default HeadingTitle;