import { SKEL_HEIGHT, SPOT_CARD_SIZES } from "@/components/constants/TrackSearchC";
import { Flex, Skeleton } from "@chakra-ui/react";

const LoadingResults = () => {
    return(
        <Flex flexDir="column" mt={10} gap={4}>
            {[...Array(3)].map((_, idx) => (
                <Skeleton key={idx} w="full" maxW={SPOT_CARD_SIZES} h={SKEL_HEIGHT} />
            ))}

            <Skeleton w="80%" h="20px" borderRadius="md" />
            <Skeleton w="80%" h="20px" borderRadius="md" />
            <Skeleton w="50%" h="20px" borderRadius="md" />
        </Flex>
    );
};

export default LoadingResults;