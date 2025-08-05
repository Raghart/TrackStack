import { CloseButton, Dialog } from "@chakra-ui/react";

const BtnCloseModal = () => {
    return(
        <Dialog.CloseTrigger m={{ base: 0, sm: 1, md: 2, lg: 3}} asChild>
            <CloseButton borderRadius="full" _hover={{ bg: "red.500" }} size={{ base: "xs", sm: "sm", md: "sm", 
                lg: "sm" }} />
        </Dialog.CloseTrigger>
    );
};

export default BtnCloseModal;