import { DURATION_FONTSIZE } from "@/components/constants/SongDetailsC";
import { Flex, Heading, Highlight } from "@chakra-ui/react";

const DurationBox = ({ duration }: { duration: number }) => {
    return(
        <Flex align="center" color="white" gap={2} _hover={{ "& .duration-hover": { scale: "1.05" } }} 
        userSelect="none">
            <Heading className="duration-hover" fontWeight="700" letterSpacing="wider" color="cyan.400" 
                textShadow="0 1px 3px black" lineHeight={1} transition="scale 0.3s ease" textAlign="center" 
                fontSize={DURATION_FONTSIZE} fontFamily="'Barlow Condensed', sans-serif">
                <Highlight query={`${duration} Min`} styles={{ color: "gray.200" }}>
                    {`Duration: ${duration} Min`}
                </Highlight>
            </Heading>     
        </Flex>
    );
};

export default DurationBox;