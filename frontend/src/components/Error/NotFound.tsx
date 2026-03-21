import { Flex, Heading, Icon } from "@chakra-ui/react";
import { Bounce } from "react-awesome-reveal";
import { IoMdWarning } from "react-icons/io";

const NotFound = ({ message }: { message: string}) => {
    return(
        <Flex align="center" justify="center" textAlign="center" w="full" py={10} userSelect="none">
            <Bounce triggerOnce>
                <Heading fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }} lineHeight={1}
                    fontFamily="'Barlow', sans-serif" fontWeight="600" lineClamp={3}>
                        <Icon as={IoMdWarning} color="yellow" boxSize={{ base: 30, sm: 39, md: 45, lg: 50 }} />
                        {message}
                </Heading>
            </Bounce>
        </Flex>
    );
};

export default NotFound;