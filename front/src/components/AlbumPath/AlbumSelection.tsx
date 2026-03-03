import { Box } from "@chakra-ui/react";
import { Zoom } from "react-awesome-reveal";
import PathHeader from "../Utils/PathHeader";

const AlbumSelection = () => {
    return(
        <Box w="full" h="full" direction="column" pt={8} gap={12} pb={20}>
            <Zoom triggerOnce direction="down" delay={100} style={{ paddingBottom: 40 }}>
                <PathHeader type={"Albums"} />
            </Zoom>
        </Box>
    )
};

export default AlbumSelection;