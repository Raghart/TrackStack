import { Box, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const GenrePagination = ({ scrollRef, atStart, atEnd } : { scrollRef: React.RefObject<HTMLDivElement | null>,
    atStart: boolean, atEnd: boolean }) => {
    const responsiveSize = useBreakpointValue({ base: 310, sm: 500, md: 670, lg: 1000, });
    
    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current || !responsiveSize) return;
        scrollRef.current.scrollBy({ left: direction === "right" ? responsiveSize : -responsiveSize, 
            behavior: "smooth" });
    };

    return(
        <Box>
            <IconButton bg="transparent" size="xs" borderRadius="full" onClick={() => scroll("left")}
                _hover={{ transform: "scale(1.2)", "& .icon-color": { color: "white" } }} disabled={atStart}>
                <Box className="icon-color" as={IoIosArrowBack} color="gray.200" />
            </IconButton>
            
            <IconButton bg="transparent" size="xs" borderRadius="full" onClick={() => scroll("right")} 
                _hover={{ transform:"scale(1.2)", "& .icon-color": { color: "white" } }} disabled={atEnd}>
                <Box className="icon-color" as={IoIosArrowForward} color="gray.200" />
            </IconButton>
        </Box>
    );
};

export default GenrePagination;