import { Box, Flex, For, Text } from "@chakra-ui/react";
import { NavItem } from "@/types/utilTypes";
import useNavButtons from "../../Utils/hooks/useNavButtons";
import HeadingTitle from "./HeadingTitle";
import NavButtonCard from "./NavButtonCard";
import { HOMEBAR_SIZES } from "@/components/constants/HomeBarC";
import { Zoom } from "react-awesome-reveal";

const HomeBar = () => {
    const NavButtons = useNavButtons();
    return(
        <Box h="full" w="100%" maxW={HOMEBAR_SIZES} bg="blackAlpha.900" borderRadius="3xl" pt={4} border="2px solid" 
            zIndex={1} borderColor="gray.800" boxShadow="md" position="fixed" maxH="85.5vh">
            <Zoom triggerOnce delay={200} direction="down">
                <HeadingTitle />
            </Zoom>
            
            <Flex direction="column" gap={2} >
                <For each={NavButtons} fallback={<Text>Error Trying to iterate through the buttons</Text> }>
                    {(navButton: NavItem) => (<NavButtonCard key={navButton.name} {...navButton} /> )}
                </For>
            </Flex>
        </Box>
    );
};

export default HomeBar;