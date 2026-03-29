import { Box, Icon, IconButton } from "@chakra-ui/react";
import { FaCircleArrowUp } from "react-icons/fa6";
import { Tooltip } from "@/components/ui/tooltip";
import useScrollUp from "./hooks/useScrollUp";
import { Bounce } from "react-awesome-reveal";

const ScrollUpArrow = () => {
    const { scrollUp, isVisible } = useScrollUp();
    return(
        <Box position="fixed" bottom="80px" right="15px" zIndex="tooltip">
            {isVisible && (
                <Bounce triggerOnce delay={200} direction="up">
                    <Tooltip content="Return to top" openDelay={100} closeDelay={0} positioning={{ placement: "left" }}
                    contentProps={{ css: { "--tooltip-bg": "colors.blue.500", "color": "white" } }} showArrow>
                        <IconButton aria-label="Scroll to top" onClick={scrollUp} boxSize="50px" boxShadow="xl"
                            _hover={{ bg:"blue.600", transform:"scale(1.1)" }} _active={{ bg: "blue.600" }} 
                            transition="background-color 0.2s ease-in-out, transform 0.2s ease-in-out" bg="blue.500"
                            borderRadius="full" shadow="lg">
                            <Icon as={FaCircleArrowUp} color="white" />
                        </IconButton>
                    </Tooltip>
                </Bounce>
            )}
        </Box>
    );
};

export default ScrollUpArrow;