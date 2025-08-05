import { Dialog, Portal } from "@chakra-ui/react";
import { useState } from "react";
import BtnOpenModal from "./BtnOpenModal.tsx";
import LaraModalHeader from "./Header/LaraModalHeader.tsx";
import BtnCloseModal from "./Header/BtnCloseModal.tsx";
import HandleModalOptions from "./HandleModalOptions.tsx";
import { AttentionSeeker, Bounce, Zoom } from "react-awesome-reveal";
import SendDataButton from "./Header/SendDataButton.tsx";

const LaraRecommendModal = () => {
    const [open, setOpen] = useState<boolean>(false);
    return(
        <Dialog.Root size="cover" placement="center" open={open} onOpenChange={(details) => setOpen(details.open)} 
            motionPreset="slide-in-bottom">
            <Bounce triggerOnce direction="down" delay={200}>
                <AttentionSeeker effect="heartBeat" delay={4000} triggerOnce>
                    <BtnOpenModal />
                </AttentionSeeker>
            </Bounce>
            
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content bg="blackAlpha.800" backdropFilter="blur(6px)" border="1px solid" 
                        borderColor="gray.700">

                        <Dialog.Header borderBottom="1px solid" borderColor="gray.700" py={3} h="80px" display="flex" 
                            alignItems="center">
                            <Zoom triggerOnce direction="left">
                                <SendDataButton setOpen={setOpen} />
                            </Zoom>
                            <LaraModalHeader />                            
                            <BtnCloseModal />
                        </Dialog.Header>

                        <Dialog.Body overflowY="auto" px={4}>
                            <Zoom triggerOnce direction="down">
                                <HandleModalOptions />
                            </Zoom>  
                        </Dialog.Body>
                        
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default LaraRecommendModal;