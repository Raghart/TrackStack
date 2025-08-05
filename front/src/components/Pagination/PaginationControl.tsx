import { Box, ButtonGroup, IconButton, Pagination } from "@chakra-ui/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const PaginationControl = ({ page, setPage, count, PageSize }: { page: number, count: number, PageSize: number,
    setPage: React.Dispatch<React.SetStateAction<number>> }) => {

    return(
        <Pagination.Root pageSize={PageSize} page={page} onPageChange={(e) => setPage(e.page)}
            count={count}>
                <ButtonGroup gap={0}>
                    <Pagination.PrevTrigger asChild>
                        <IconButton bg="transparent" size="xs" borderRadius="full" 
                            _hover={{ transform: "scale(1.2)", "& .icon-color": { color: "white" } }}>
                            <Box className="icon-color" as={IoIosArrowBack} color="gray.200" />
                        </IconButton>
                    </Pagination.PrevTrigger>
                    <Pagination.NextTrigger asChild>
                        <IconButton bg="transparent" size="xs" borderRadius="full" _hover={{ transform: "scale(1.2)",
                            "& .icon-color": { color: "white" } }}>
                            <Box className="icon-color" as={IoIosArrowForward} color="gray.200" />
                        </IconButton>
                    </Pagination.NextTrigger>
                </ButtonGroup>
        </Pagination.Root>
    );
};

export default PaginationControl;