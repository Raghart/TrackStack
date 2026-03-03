import { Box } from "@chakra-ui/react";
import AlbumHeader from "./AlbumHeader";
import { Zoom } from "react-awesome-reveal";

const AlbumSelection = () => {
    return(
        <Box w="full" h="full" direction="column" pt={8} gap={12} pb={20}>
            <Zoom triggerOnce direction="down" delay={100} style={{ paddingBottom: 40 }}>
                <AlbumHeader />
            </Zoom>
        </Box>
    )
};

export default AlbumSelection;