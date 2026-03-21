import { YEAR_FONTSIZE } from "@/components/constants/SongDetailsC";
import { Box, Heading } from "@chakra-ui/react";

const YearBox = ({ year }: { year: number }) => {
    return(
        <Box textAlign="center" maxW="340px" color="white" transition="all 0.3s ease" userSelect="none"
            borderRadius="xl" _hover={{ "& .year-hover": { scale:"1.05" } }}>
            <Heading className="year-hover" letterSpacing="wider" transition="scale 0.3s ease, text-shadow 0.3s ease"
                color="gray.300" textShadow="0 1px 3px black" lineHeight="shorter" fontSize={YEAR_FONTSIZE} 
                fontFamily="'Barlow Condensed', sans-serif" fontWeight="800">
                {year}
            </Heading>
        </Box>
    );
};

export default YearBox;