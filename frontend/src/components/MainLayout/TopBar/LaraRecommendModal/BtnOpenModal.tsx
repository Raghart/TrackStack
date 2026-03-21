import { Tooltip } from "@/components/ui/tooltip";
import { Dialog, Icon, IconButton } from "@chakra-ui/react";
import { TbMusicSearch } from "react-icons/tb";

const BtnOpenModal = () => {
    return(
        <Tooltip showArrow content="Get personalized AI picks" openDelay={200} closeDelay={0}
            contentProps={{ css: { "--tooltip-bg": "colors.blue.500", color: "white" } }}>
            <Dialog.Trigger asChild>
                <IconButton bg="blue.600" size={{ base: "sm", sm:"sm", md: "md", lg: "md" }} boxShadow="md"
                    borderRadius="full" _hover={{ bg: "blue.700", "& .hover-button": { color: "gray.200" } }}
                    data-testid="LaraBtn">
                    <Icon className="hover-button" as={TbMusicSearch} color="white" />
                </IconButton>
            </Dialog.Trigger>
        </Tooltip>
    );
};

export default BtnOpenModal;